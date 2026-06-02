import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { createRateLimitMiddleware } from "../middlewares/rateLimitMiddleware.js";
import {
  predictDisease,
  getSymptoms,
} from "../controllers/predictController.js";

const router = express.Router();

// Create rate limit middleware for prediction operations
const predictRateLimit = createRateLimitMiddleware({
  identifier: "user",
  envKey: "RATE_LIMIT_PREDICT",
});

router.post("/predict", verifyToken, predictRateLimit, predictDisease);
router.get("/symptoms", getSymptoms);

export default router;
