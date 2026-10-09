import { PrismChatError } from "./prism-chat.ts";

type Kind = "session" | "message";
type Bucket = { started: number; count: number };

// Per Node process. Prism also enforces its configured per-interface rate limit.
// Deployments with multiple instances need a shared gateway/store for fleet-wide limits.
export class PrismChatLimiter {
  private buckets = new Map<string, Bucket>();
  private active = 0;
  private activeByIp = new Map<string, number>();
  private readonly maxConcurrent: number;
  private readonly windowMs: number;
  private readonly maxConcurrentPerIp: number;
  constructor(maxConcurrent = 8, windowMs = 10 * 60_000, maxConcurrentPerIp = 2) {
    this.maxConcurrent = maxConcurrent;
    this.windowMs = windowMs;
    this.maxConcurrentPerIp = maxConcurrentPerIp;
  }

  acquire(kind: Kind, ip: string, now = Date.now()): () => void {
    const key = `${kind}:${ip}`;
    const limit = kind === "session" ? 20 : 30;
    const previous = this.buckets.get(key);
    const bucket = previous && now - previous.started < this.windowMs ? previous : { started: now, count: 0 };
    if (bucket.count >= limit || this.active >= this.maxConcurrent || (this.activeByIp.get(ip) ?? 0) >= this.maxConcurrentPerIp) {
      throw new PrismChatError(429, "Queen Raida is busy. Please try again in a moment.");
    }
    bucket.count += 1;
    this.buckets.set(key, bucket);
    this.active += 1;
    this.activeByIp.set(ip, (this.activeByIp.get(ip) ?? 0) + 1);
    if (this.buckets.size > 5000) {
      for (const [entry, value] of this.buckets) {
        if (now - value.started >= this.windowMs) this.buckets.delete(entry);
      }
      // Bound memory even if callers rotate IPs within a single window.
      while (this.buckets.size > 5000) this.buckets.delete(this.buckets.keys().next().value!);
    }
    let released = false;
    return () => {
      if (!released) {
        this.active -= 1;
        const remaining = (this.activeByIp.get(ip) ?? 1) - 1;
        if (remaining > 0) this.activeByIp.set(ip, remaining);
        else this.activeByIp.delete(ip);
        released = true;
      }
    };
  }
}

export const prismChatLimiter = new PrismChatLimiter();

export function chatClientIp(request: Request): string {
  // Railway supplies the remote client in X-Real-IP. Prefer it over client-provided X-Forwarded-For values.
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp && realIp.length <= 64 && /^[a-fA-F0-9:.]+$/.test(realIp)) return realIp;
  // Fallback for other proxies: the trusted edge appends the actual peer last.
  const forwarded = request.headers.get("x-forwarded-for");
  const candidate = forwarded?.split(",").at(-1)?.trim() || "unknown";
  return candidate.length <= 64 && /^[a-fA-F0-9:.]+$/.test(candidate) ? candidate : "unknown";
}
