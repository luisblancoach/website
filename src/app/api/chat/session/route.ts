import { NextRequest, NextResponse } from "next/server";
import { chatCookieName, chatCookieOptions, signChatSession } from "@/lib/server/prism-chat-session";
import { chatClientIp, prismChatLimiter } from "@/lib/server/prism-chat-limits";
import { createPrismSession, getPrismChatConfig, isSameOrigin, PrismChatError } from "@/lib/server/prism-chat";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  const config = getPrismChatConfig();
  if (!config) return NextResponse.json({ error: "Queen Raida is not configured yet." }, { status: 503 });
  let release: (() => void) | undefined;
  try {
    release = prismChatLimiter.acquire("session", chatClientIp(request));
    const sessionId = await createPrismSession(config);
    const response = NextResponse.json({ ok: true }, { headers: { "cache-control": "no-store" } });
    response.cookies.set(chatCookieName(), signChatSession(sessionId, config.key), chatCookieOptions());
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof PrismChatError ? error.message : "Queen Raida is unavailable right now." }, { status: error instanceof PrismChatError ? error.status : 502 });
  } finally {
    release?.();
  }
}
