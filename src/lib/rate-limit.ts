/**
 * Fixed-window rate limiter (in-memory). Single-process only.
 * For multi-instance deployments, replace with Redis (Upstash, Redis Cloud).
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetInMs: number;
}

export function rateLimit(
  key: string,
  options: { limit: number; windowMs: number }
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const fresh: Bucket = { count: 1, resetAt: now + options.windowMs };
    buckets.set(key, fresh);
    return { ok: true, remaining: options.limit - 1, resetInMs: options.windowMs };
  }

  if (existing.count >= options.limit) {
    return { ok: false, remaining: 0, resetInMs: existing.resetAt - now };
  }

  existing.count += 1;
  return {
    ok: true,
    remaining: options.limit - existing.count,
    resetInMs: existing.resetAt - now,
  };
}

export function getClientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0];
    if (first) return first.trim();
  }
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  return "anonymous";
}
