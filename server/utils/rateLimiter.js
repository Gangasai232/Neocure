// In-memory sliding window rate limiter (Redis-free)
const inMemoryStore = new Map();

/**
 * Sliding window rate limiter using in-memory Map
 * @param {string} key - Unique identifier (e.g., user ID or IP address)
 * @param {number} limit - Number of allowed requests
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Promise<{allowed: boolean, remaining: number, resetTime: number}>}
 */
export const checkLimit = async (key, limit, windowMs) => {
  try {
    const now = Date.now();
    const windowStart = now - windowMs;

    let timestamps = inMemoryStore.get(key) || [];
    timestamps = timestamps.filter((timestamp) => timestamp > windowStart);

    if (timestamps.length >= limit) {
      const resetTime = timestamps[0] + windowMs;
      return { allowed: false, remaining: 0, resetTime };
    }

    timestamps.push(now);
    inMemoryStore.set(key, timestamps);

    const remaining = limit - timestamps.length;
    const resetTime = now + windowMs;

    return { allowed: true, remaining, resetTime };
  } catch (error) {
    console.error("Rate limiter error:", error.message);
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
    return { limit: 100, windowMs: 15 * 60 * 1000 };
  }

  const [attempts, minutes] = configString.split(":");
  const limit = parseInt(attempts);
  const windowMs = parseInt(minutes) * 60 * 1000;

  if (isNaN(limit) || isNaN(windowMs) || limit <= 0 || windowMs <= 0) {
    return { limit: 100, windowMs: 15 * 60 * 1000 };
  }

  return { limit, windowMs };
};
