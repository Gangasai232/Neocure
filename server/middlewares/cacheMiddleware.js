import { cache } from "../utils/cache.js";
import authModel from "../models/authModel.js";

// Cache user role for quick verification (TTL: 5 minutes)
export const cacheUserRole = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next();

    // Check if role is cached
    const cachedRole = await cache.get(`user:${userId}:role`);
    if (cachedRole) {
      req.user.role = cachedRole;
      return next();
    }

    // Fetch from DB and cache
    const user = await authModel.findById(userId);
    if (user) {
      await cache.set(`user:${userId}:role`, user.role, 300); // 5 min TTL
      req.user.role = user.role;
    }

    next();
  } catch (err) {
    console.error("Cache middleware error:", err);
    next();
  }
};

// Cache user profile (TTL: 10 minutes)
export const cacheUserProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next();

    // Check if profile is cached
    const cached = await cache.get(`user:${userId}:profile`);
    if (cached) {
      req.cachedUser = cached;
      return next();
    }

    // Fetch from DB and cache
    const user = await authModel.findById(userId).select("-password");
    if (user) {
      const userObj = user.toObject();
      await cache.set(`user:${userId}:profile`, userObj, 600); // 10 min TTL
      req.cachedUser = userObj;
    }

    next();
  } catch (err) {
    console.error("Cache middleware error:", err);
    next();
  }
};

export default { cacheUserRole, cacheUserProfile };
