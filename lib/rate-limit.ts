import type { NextRequest } from "next/server";

// Redis-backed rate limiting (requires UPSTASH_REDIS_REST_URL + TOKEN).
// Falls back to no-op when Redis is not configured so the app works without it.

const url = process.env.UPSTASH_REDIS_REST_URL ?? "";
const HAS_REDIS =
  url.length > 0 &&
  !url.includes("placeholder") &&
  url.startsWith("https://");

type LimitResult = { success: boolean; remaining: number; reset: number };

const NOOP_RESULT: LimitResult = { success: true, remaining: 999, reset: 0 };

/** Create a rate-limiter. Returns a noop limiter when Redis is not configured. */
function createLimiter(requests: number, windowSeconds: number) {
  if (!HAS_REDIS) {
    return { limit: async (_id: string): Promise<LimitResult> => NOOP_RESULT };
  }

  // Lazy imports so the module doesn't crash on import when Redis is unconfigured
  const { Ratelimit } = require("@upstash/ratelimit");
  const { Redis } = require("@upstash/redis");

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, `${windowSeconds} s`),
    analytics: false,
  });
}

// 5 lead form submissions per IP per hour
export const formRateLimit = createLimiter(5, 3600);

// 20 API calls per user per minute
export const apiRateLimit = createLimiter(20, 60);

// 5 invite calls per admin per hour
export const inviteRateLimit = createLimiter(5, 3600);

/** Extract a meaningful identifier for rate limiting (IP with X-Forwarded-For support). */
export function getIdentifier(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

/** Apply a rate limit and return a 429 Response if exceeded, or null if allowed. */
export async function applyRateLimit(
  limiter: { limit: (id: string) => Promise<LimitResult> },
  identifier: string
): Promise<Response | null> {
  try {
    const result = await limiter.limit(identifier);
    if (!result.success) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil((result.reset - Date.now()) / 1000)),
          },
        }
      );
    }
    return null;
  } catch {
    // Rate limiter unavailable — fail open
    return null;
  }
}
