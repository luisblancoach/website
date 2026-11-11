import { createHmac, timingSafeEqual } from "node:crypto";

export const CHAT_SESSION_SECONDS = 60 * 60 * 4;

export function chatCookieName(production = process.env.NODE_ENV === "production"): string {
  return production ? "__Host-rg_prism_chat" : "rg_prism_chat_dev";
}

export function chatCookieOptions(production = process.env.NODE_ENV === "production") {
  return {
    httpOnly: true,
    secure: production,
    sameSite: "strict" as const,
    // __Host- cookies must be bound to the host root. No Domain attribute is set.
    path: "/",
    maxAge: CHAT_SESSION_SECONDS,
  };
}

type SessionToken = { id: string; exp: number };

function signingKey(secret: string): Buffer {
  return createHmac("sha256", secret).update("raidguild-prism-chat-session-v1").digest();
}

export function signChatSession(id: string, secret: string, now = Date.now()): string {
  const payload = Buffer.from(JSON.stringify({ id, exp: Math.floor(now / 1000) + CHAT_SESSION_SECONDS })).toString("base64url");
  const signature = createHmac("sha256", signingKey(secret)).update(payload).digest("base64url");
  return `v1.${payload}.${signature}`;
}

export function verifyChatSession(token: string | undefined, secret: string, now = Date.now()): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1" || !parts[1] || !parts[2]) return null;
  const actual = Buffer.from(parts[2], "base64url");
  const expected = createHmac("sha256", signingKey(secret)).update(parts[1]).digest();
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")) as SessionToken;
    if (typeof parsed.id !== "string" || parsed.id.length < 1 || parsed.id.length > 128) return null;
    if (!Number.isInteger(parsed.exp) || parsed.exp <= Math.floor(now / 1000)) return null;
    return parsed.id;
  } catch {
    return null;
  }
}
