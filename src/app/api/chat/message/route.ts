import { NextRequest, NextResponse } from "next/server";
import { chatCookieName, chatCookieOptions, signChatSession, verifyChatSession } from "@/lib/server/prism-chat-session";
import { chatClientIp, prismChatLimiter } from "@/lib/server/prism-chat-limits";
import { createPrismSession, getPrismChatConfig, isSameOrigin, PrismChatError, readChatBody, sendPrismMessageWithRecovery, validateChatMessage } from "@/lib/server/prism-chat";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  const config = getPrismChatConfig();
  if (!config) return NextResponse.json({ error: "Queen Raida is not configured yet." }, { status: 503 });
  let release: (() => void) | undefined;
  try {
    const body = await readChatBody(request);
    const content = validateChatMessage(body.content);
    if (!content) return NextResponse.json({ error: "Enter a message of up to 4,000 characters." }, { status: 400 });
    const ip = chatClientIp(request);
    release = prismChatLimiter.acquire("message", ip);
    // A browser-supplied session ID is never accepted. Only our signed HttpOnly cookie can resume a conversation.
    let sessionId = verifyChatSession(request.cookies.get(chatCookieName())?.value, config.key);
    if (!sessionId) {
      const releaseSession = prismChatLimiter.acquire("session", ip);
      try { sessionId = await createPrismSession(config); }
      finally { releaseSession(); }
    }
    // If Prism expired the session, retry once with a fresh upstream conversation.
    const result = await sendPrismMessageWithRecovery(config, sessionId, content);
    sessionId = result.sessionId;
    const reply = result.reply;
    const response = NextResponse.json({ message: reply }, { headers: { "cache-control": "no-store" } });
    response.cookies.set(chatCookieName(), signChatSession(sessionId, config.key), chatCookieOptions());
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof PrismChatError ? error.message : "Queen Raida is unavailable right now." }, { status: error instanceof PrismChatError ? error.status : 502 });
  } finally {
    release?.();
  }
}
