import { createClient } from "redis";

let redisClient = null;

// Initialize Redis client
export const initRedis = async () => {
  try {
    redisClient = createClient({
      password: process.env.REDIS_PASSWORD || undefined,
      socket: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
      },
    });

    redisClient.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    redisClient.on("connect", () => {
      console.log("Redis Connected Successfully");
    });

    await redisClient.connect();
    return redisClient;
  } catch (err) {
    console.error("Failed to initialize Redis:", err);
    redisClient = null;
  }
};

// Get Redis client instance
export const getRedis = () => redisClient;

// Cache operations
export const cache = {
  // Set cache with TTL
  async set(key, value, ttl = 300) {
    try {
      if (!redisClient) return null;

      const serialized = JSON.stringify(value);

      if (ttl) {
        await redisClient.setEx(key, ttl, serialized);
      } else {
        await redisClient.set(key, serialized);
      }

      return true;
    } catch (err) {
      console.error(`Cache SET error for ${key}:`, err);
      return null;
    }
  },

  // Get cache value
  async get(key) {
    try {
      if (!redisClient) return null;

      const data = await redisClient.get(key);
      if (!data) return null;

      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    } catch (err) {
      console.error(`Cache GET error for ${key}:`, err);
      return null;
    }
  },

  // Delete cache key
  async del(key) {
    try {
      if (!redisClient) return null;
      return await redisClient.del(key);
    } catch (err) {
      console.error(`Cache DEL error for ${key}:`, err);
      return null;
    }
  },

  // Delete multiple keys by pattern (non-blocking)
  async delPattern(pattern) {
    try {
      if (!redisClient) return 0;

      let cursor = 0;
      let deleted = 0;

      do {
        const { cursor: next, keys } = await redisClient.scan(cursor, {
          MATCH: pattern,
          COUNT: 100,
        });

        cursor = Number(next);

        if (keys.length) {
          deleted += await redisClient.del(keys);
        }
      } while (cursor !== 0);

      return deleted;
    } catch (err) {
      console.error(`Cache DELPATTERN error for ${pattern}:`, err);
      return 0;
    }
  },
};
