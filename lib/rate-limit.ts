import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 5 form submissions per IP per hour
export const formRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  analytics: true,
  prefix: "ratelimit:form",
});

// 20 API calls per user per minute
export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  analytics: true,
  prefix: "ratelimit:api",
});

// 3 login attempts per IP per 15 min
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "15 m"),
  analytics: true,
  prefix: "ratelimit:auth",
});
