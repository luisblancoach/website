import test from "node:test";
import assert from "node:assert/strict";
import { chatCookieName, chatCookieOptions, signChatSession, verifyChatSession } from "../src/lib/server/prism-chat-session.ts";
import { getPrismChatConfig, validateChatMessage, isSameOrigin, readChatBody, PrismChatError, createPrismSession, sendPrismMessage, sendPrismMessageWithRecovery } from "../src/lib/server/prism-chat.ts";
import { chatClientIp, PrismChatLimiter } from "../src/lib/server/prism-chat-limits.ts";

test("only a correctly signed, unexpired session is accepted", () => {
  const now = Date.now();
  const token = signChatSession("session-one", "server-secret", now);
  assert.equal(verifyChatSession(token, "server-secret", now), "session-one");
  assert.equal(verifyChatSession(token, "wrong-secret", now), null);
  assert.equal(verifyChatSession(token, "server-secret", now + 5 * 60 * 60 * 1000), null);
  const parts = token.split(".");
  const forgedPayload = Buffer.from(JSON.stringify({ id: "another-session", exp: Math.floor(now / 1000) + 60 })).toString("base64url");
  assert.equal(verifyChatSession(`v1.${forgedPayload}.${parts[2]}`, "server-secret", now), null);
});

test("production cookie is host bound and cannot collide with development cookie", () => {
  assert.equal(chatCookieName(true), "__Host-rg_prism_chat");
  assert.equal(chatCookieName(false), "rg_prism_chat_dev");
  assert.deepEqual(chatCookieOptions(true), { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 14400 });
  assert.equal(Object.hasOwn(chatCookieOptions(true), "domain"), false);
  const cookies = new Map([[chatCookieName(false), signChatSession("attacker-session", "server-secret")]]);
  assert.equal(verifyChatSession(cookies.get(chatCookieName(true)), "server-secret"), null);
});

test("Prism key stays in server config and missing key disables chat", () => {
  assert.equal(getPrismChatConfig({}), null);
  assert.deepEqual(getPrismChatConfig({ PRISM_INTERFACE_KEY: "secret" }), {
    key: "secret", sessionsUrl: "https://comms-adapter.up.railway.app/interactions/external-chatbot/sessions",
  });
  assert.equal(getPrismChatConfig({ PRISM_INTERFACE_KEY: "secret", PRISM_INTERFACE_BASE_URL: "http://evil.example" }), null);
});

test("message and origin validation reject unsafe requests", async () => {
  assert.equal(validateChatMessage("  hello  "), "hello");
  assert.equal(validateChatMessage(" "), null);
  assert.equal(validateChatMessage("x".repeat(4001)), null);
  assert.equal(isSameOrigin(new Request("https://raidguild.org/api/chat/message", { method: "POST", headers: { origin: "https://evil.example" } })), false);
  assert.equal(isSameOrigin(new Request("https://raidguild.org/api/chat/message", { method: "POST", headers: { origin: "https://raidguild.org" } })), true);
  const railwayRequest = new Request("http://localhost:3000/api/chat/message", { method: "POST", headers: {
    origin: "https://www.raidguild.org", "x-railway-edge": "iad1", "x-real-ip": "1.2.3.4",
    "x-forwarded-proto": "https", "x-forwarded-host": "www.raidguild.org",
  } });
  assert.equal(isSameOrigin(railwayRequest, { RAILWAY_ENVIRONMENT_ID: "production" }), true);
  assert.equal(isSameOrigin(railwayRequest, {}), false);
  assert.equal(isSameOrigin(new Request("http://localhost:3000/api/chat/message", { method: "POST", headers: { origin: "https://www.raidguild.org", "x-forwarded-proto": "https", "x-forwarded-host": "www.raidguild.org" } }), { RAILWAY_ENVIRONMENT_ID: "production" }), false);
  await assert.rejects(readChatBody(new Request("https://raidguild.org/api/chat/message", { method: "POST", headers: { "content-type": "text/plain" }, body: "hello" })), (error) => error instanceof PrismChatError && error.status === 415);
  await assert.rejects(readChatBody(new Request("https://raidguild.org/api/chat/message", { method: "POST", headers: { "content-type": "application/json" }, body: "x".repeat(8200) })), (error) => error instanceof PrismChatError && error.status === 413);
});

test("server transport authenticates upstream and returns only reply text", async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return Response.json(calls.length === 1 ? { sessionId: "session-one" } : { message: { role: "assistant", content: "Hello from the Guild" } });
  };
  try {
    const config = getPrismChatConfig({ PRISM_INTERFACE_KEY: "server-only-secret" });
    const session = await createPrismSession(config);
    assert.equal(await sendPrismMessage(config, session, "What is RaidGuild?"), "Hello from the Guild");
    assert.equal(calls[0].url, "https://comms-adapter.up.railway.app/interactions/external-chatbot/sessions");
    assert.equal(calls[1].url, `${calls[0].url}/session-one/messages`);
    assert.equal(calls[0].options.headers.authorization, "Bearer server-only-secret");
    assert.equal(calls[1].options.redirect, "error");
    assert.equal(calls[1].options.body, JSON.stringify({ content: "What is RaidGuild?" }));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("upstream rate limit becomes a safe retry message", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(null, { status: 429 });
  try {
    await assert.rejects(createPrismSession(getPrismChatConfig({ PRISM_INTERFACE_KEY: "server-only-secret" })),
      error => error instanceof PrismChatError && error.status === 429 && !error.message.includes("server-only-secret"));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("expired upstream session gets one fresh session and one message retry", async () => {
  const originalFetch = globalThis.fetch;
  const urls = [];
  globalThis.fetch = async (url) => {
    urls.push(url);
    if (urls.length === 1) return new Response(null, { status: 404 });
    if (urls.length === 2) return Response.json({ sessionId: "fresh-session" }, { status: 201 });
    return Response.json({ message: { content: "Recovered" } });
  };
  try {
    const config = getPrismChatConfig({ PRISM_INTERFACE_KEY: "server-secret" });
    assert.deepEqual(await sendPrismMessageWithRecovery(config, "expired-session", "hello"), { sessionId: "fresh-session", reply: "Recovered" });
    assert.deepEqual(urls, [
      `${config.sessionsUrl}/expired-session/messages`,
      config.sessionsUrl,
      `${config.sessionsUrl}/fresh-session/messages`,
    ]);
  } finally { globalThis.fetch = originalFetch; }
});

test("per-IP and concurrent limits reject excess requests", () => {
  const limiter = new PrismChatLimiter(1, 60_000);
  const release = limiter.acquire("message", "1.2.3.4", 0);
  assert.throws(() => limiter.acquire("message", "5.6.7.8", 0), error => error instanceof PrismChatError && error.status === 429);
  release();
  release();
  for (let count = 1; count < 30; count++) limiter.acquire("message", "1.2.3.4", 0)();
  assert.throws(() => limiter.acquire("message", "1.2.3.4", 0), error => error instanceof PrismChatError && error.status === 429);
  limiter.acquire("message", "1.2.3.4", 60_001)();
  assert.equal(chatClientIp(new Request("https://raidguild.org", { headers: { "x-forwarded-for": "spoofed, 1.2.3.4" } })), "1.2.3.4");
  assert.equal(chatClientIp(new Request("https://raidguild.org", { headers: { "x-real-ip": "5.6.7.8", "x-forwarded-for": "spoofed, 1.2.3.4" } })), "5.6.7.8");
  const parallel = new PrismChatLimiter(8, 60_000, 2);
  const first = parallel.acquire("message", "1.2.3.4", 0);
  const second = parallel.acquire("message", "1.2.3.4", 0);
  assert.throws(() => parallel.acquire("message", "1.2.3.4", 0), error => error instanceof PrismChatError && error.status === 429);
  const otherIp = parallel.acquire("message", "5.6.7.8", 0);
  first(); second(); otherIp();
});
