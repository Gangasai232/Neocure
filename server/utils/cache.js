// In-memory cache implementation (Redis-free)
const inMemoryCache = new Map();

export const initRedis = async () => {
  return null;
};

export const getRedis = () => null;

export const cache = {
  // Set cache with TTL (seconds)
  async set(key, value, ttl = 300) {
    try {
      const expireAt = ttl ? Date.now() + ttl * 1000 : null;
      inMemoryCache.set(key, { value, expireAt });
      return true;
    } catch (err) {
      console.error(`Cache SET error for ${key}:`, err);
      return null;
    }
  },

  // Get cache value
  async get(key) {
    try {
      const item = inMemoryCache.get(key);
      if (!item) return null;

      if (item.expireAt && Date.now() > item.expireAt) {
        inMemoryCache.delete(key);
        return null;
      }

      return item.value;
    } catch (err) {
      console.error(`Cache GET error for ${key}:`, err);
      return null;
    }
  },

  // Delete cache key
  async del(key) {
    try {
      return inMemoryCache.delete(key);
    } catch (err) {
      console.error(`Cache DEL error for ${key}:`, err);
      return null;
    }
  },

  // Delete multiple keys by pattern
  async delPattern(pattern) {
    try {
      const regexStr = "^" + pattern.replace(/\*/g, ".*") + "$";
      const regex = new RegExp(regexStr);
      let count = 0;

      for (const key of inMemoryCache.keys()) {
        if (regex.test(key)) {
          inMemoryCache.delete(key);
          count++;
        }
      }

      return count;
    } catch (err) {
      console.error(`Cache DELPATTERN error for ${pattern}:`, err);
      return 0;
    }
  },
};
