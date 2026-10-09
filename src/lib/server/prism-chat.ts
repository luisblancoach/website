const DEFAULT_BASE_URL = "https://comms-adapter.up.railway.app";
const DEFAULT_INTERFACE_ID = "external-chatbot";
const UPSTREAM_TIMEOUT_MS = 90_000;

export class PrismChatError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export class PrismSessionGoneError extends PrismChatError {
  constructor() { super(502, "The conversation expired. Please try again."); }
}

export type PrismChatConfig = { key: string; sessionsUrl: string };

export function getPrismChatConfig(env: NodeJS.ProcessEnv = process.env): PrismChatConfig | null {
  const key = env.PRISM_INTERFACE_KEY?.trim();
  if (!key) return null;
  try {
    const base = new URL(env.PRISM_INTERFACE_BASE_URL || DEFAULT_BASE_URL);
    const interfaceId = env.PRISM_INTERFACE_ID || DEFAULT_INTERFACE_ID;
    if (base.protocol !== "https:" || base.username || base.password || base.search || base.hash || !/^[a-z0-9-]+$/.test(interfaceId)) return null;
    return { key, sessionsUrl: `${base.toString().replace(/\/$/, "")}/interactions/${interfaceId}/sessions` };
  } catch {
    return null;
  }
}

async function prismRequest(url: string, config: PrismChatConfig, body: object, messageRequest = false): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { authorization: `Bearer ${config.key}`, "content-type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch {
    throw new PrismChatError(502, "Queen Raida is unavailable right now. Please try again later.");
  }
  if (messageRequest && response.status === 404) throw new PrismSessionGoneError();
  if (response.status === 429) throw new PrismChatError(429, "Queen Raida is busy. Please try again in a moment.");
  if (!response.ok) throw new PrismChatError(502, "Queen Raida is unavailable right now. Please try again later.");
  try {
    return await response.json();
  } catch {
    throw new PrismChatError(502, "Queen Raida returned an unreadable response.");
  }
}

export async function createPrismSession(config: PrismChatConfig): Promise<string> {
  const payload = await prismRequest(config.sessionsUrl, config, {}) as { sessionId?: unknown };
  if (typeof payload?.sessionId !== "string" || !payload.sessionId || payload.sessionId.length > 128) {
    throw new PrismChatError(502, "Queen Raida returned an unreadable response.");
  }
  return payload.sessionId;
}

export async function sendPrismMessage(config: PrismChatConfig, sessionId: string, content: string): Promise<string> {
  const payload = await prismRequest(`${config.sessionsUrl}/${encodeURIComponent(sessionId)}/messages`, config, { content }, true) as { message?: { content?: unknown } };
  if (typeof payload?.message?.content !== "string") {
    throw new PrismChatError(502, "Queen Raida returned an unreadable response.");
  }
  return payload.message.content;
}

export async function sendPrismMessageWithRecovery(config: PrismChatConfig, sessionId: string, content: string): Promise<{ sessionId: string; reply: string }> {
  try {
    return { sessionId, reply: await sendPrismMessage(config, sessionId, content) };
  } catch (error) {
    if (!(error instanceof PrismSessionGoneError)) throw error;
    const freshSessionId = await createPrismSession(config);
    return { sessionId: freshSessionId, reply: await sendPrismMessage(config, freshSessionId, content) };
  }
}

export function validateChatMessage(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const content = value.trim();
  return content && content.length <= 4000 ? content : null;
}

export function isSameOrigin(request: Request, env: NodeJS.ProcessEnv = process.env): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const browserOrigin = new URL(origin).origin;
    if (browserOrigin === new URL(request.url).origin) return true;
    // Railway terminates HTTPS at its edge. Only trust its forwarded public origin
    // on a Railway deployment with a recognizable edge marker and client IP.
    if (!env.RAILWAY_ENVIRONMENT_ID || !/^[a-z]{3}[0-9]+$/i.test(request.headers.get("x-railway-edge") || "") || !request.headers.get("x-real-ip")) return false;
    if (request.headers.get("x-forwarded-proto") !== "https") return false;
    const host = request.headers.get("x-forwarded-host") || "";
    if (!/^[a-z0-9.-]+(?::[0-9]{1,5})?$/i.test(host)) return false;
    return browserOrigin === new URL(`https://${host}`).origin;
  } catch { return false; }
}

export async function readChatBody(request: Request): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) throw new PrismChatError(415, "Send a JSON request.");
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > 8192) throw new PrismChatError(413, "Message is too long.");
  const reader = request.body?.getReader();
  if (!reader) throw new PrismChatError(400, "Send a valid message.");
  const chunks: Uint8Array[] = [];
  let received = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > 8192) {
      void reader.cancel();
      throw new PrismChatError(413, "Message is too long.");
    }
    chunks.push(value);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("invalid");
    return parsed as Record<string, unknown>;
  } catch {
    throw new PrismChatError(400, "Send a valid message.");
  }
}
