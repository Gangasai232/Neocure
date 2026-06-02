import { getRedis } from "./cache.js";

/**
 * Sliding window rate limiter using Redis
 * @param {string} key - Unique identifier (e.g., user ID or IP address)
 * @param {number} limit - Number of allowed requests
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Promise<{allowed: boolean, remaining: number, resetTime: number}>}
 */
export const checkLimit = async (key, limit, windowMs) => {
  const redis = getRedis();

  if (!redis) {
    // Fail-open: if Redis is unavailable, allow the request
    return {
      allowed: true,
      remaining: limit,
      resetTime: Date.now() + windowMs,
    };
  }

  try {
    const now = Date.now();
    const windowStart = now - windowMs;
    const redisKey = `rate_limit:${key}`;

    // Get all requests within the window
    const count = await redis.zcount(redisKey, windowStart, now);

    if (count >= limit) {
      // Rate limit exceeded
      const oldestRequest = await redis.zrange(redisKey, 0, 0);
      const resetTime =
        oldestRequest && oldestRequest.length > 0
          ? parseInt(oldestRequest[0]) + windowMs
          : now + windowMs;

      return { allowed: false, remaining: 0, resetTime };
    }

    // Add current request to sorted set with timestamp as both score and member
    await redis.zadd(redisKey, now, now.toString());

    // Set expiration to window duration
    await redis.expire(redisKey, Math.ceil(windowMs / 1000));

    const remaining = limit - count - 1;
    const resetTime = now + windowMs;

    return { allowed: true, remaining, resetTime };
  } catch (error) {
    console.error("Rate limiter error:", error.message);
    // Fail-open on error
    return {
      allowed: true,
      remaining: limit,
      resetTime: Date.now() + windowMs,
    };
  }
};

/**
 * Parse rate limit config from .env format
 * @param {string} configString - Format: "attempts:minutes" (e.g., "5:15")
 * @returns {{limit: number, windowMs: number}}
 */
export const parseRateLimitConfig = (configString) => {
  if (!configString) {
    throw new Error("Rate limit config is required");
  }

  const [attempts, minutes] = configString.split(":");
  const limit = parseInt(attempts);
  const windowMs = parseInt(minutes) * 60 * 1000;

  if (isNaN(limit) || isNaN(windowMs) || limit <= 0 || windowMs <= 0) {
    throw new Error(
      `Invalid rate limit config: ${configString}. Expected format: "attempts:minutes"`
    );
  }

  return { limit, windowMs };
};
