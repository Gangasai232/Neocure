import { checkLimit, parseRateLimitConfig } from "../utils/rateLimiter.js";

export const createRateLimitMiddleware = (config) => {
  const { identifier, envKey } = config;

  // Parse configuration at middleware creation time
  const rateLimitConfig = process.env[envKey] || "100:15";
  let parsedConfig;
  try {
    parsedConfig = parseRateLimitConfig(rateLimitConfig);
  } catch (error) {
    parsedConfig = { limit: 100, windowMs: 15 * 60 * 1000 };
  }

  return async (req, res, next) => {
    // Skip if rate limiting is disabled
    if (process.env.RATE_LIMIT_ENABLED === "false") {
      return next();
    }

    try {
      // Determine the key for rate limiting
      let key;
      if (identifier === "ip") {
        key = req.ip || req.connection.remoteAddress || "unknown";
      } else if (identifier === "user") {
        if (!req.user || !req.user.id) {
          return res.status(401).json({
            success: false,
            message: "User not authenticated",
          });
        }
        key = `user:${req.user.id}`;
      } else {
        throw new Error(`Invalid identifier: ${identifier}`);
      }

      // Check rate limit
      const result = await checkLimit(
        key,
        parsedConfig.limit,
        parsedConfig.windowMs
      );

      // Set rate limit headers for transparency
      res.set({
        "X-RateLimit-Limit": parsedConfig.limit,
        "X-RateLimit-Remaining": Math.max(0, result.remaining),
        "X-RateLimit-Reset": Math.ceil(result.resetTime / 1000), // Unix timestamp
      });

      if (!result.allowed) {
        const secondsUntilReset = Math.ceil(
          (result.resetTime - Date.now()) / 1000
        );
        return res.status(429).json({
          success: false,
          message: `Rate limit exceeded. Try again in ${secondsUntilReset} seconds.`,
        });
      }

      next();
    } catch (error) {
      console.error("Rate limit middleware error:", error.message);
      // Fail-open: allow the request on unexpected errors
      next();
    }
  };
};
