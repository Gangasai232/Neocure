import express from "express";
import { body } from "express-validator";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { createRateLimitMiddleware } from "../middlewares/rateLimitMiddleware.js";

const router = express.Router();

// Create rate limit middlewares
const loginRateLimit = createRateLimitMiddleware({
  identifier: "ip",
  envKey: "RATE_LIMIT_LOGIN",
});

const registerRateLimit = createRateLimitMiddleware({
  identifier: "ip",
  envKey: "RATE_LIMIT_REGISTER",
});

router.post(
  "/register",
  registerRateLimit,
  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be 3-20 characters"),

    body("email")
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be atleast 8 characters"),
    body("cnfpass").custom((value, { req }) => {
      if (value != req.body.password) {
        throw new Error("Passwords don't match");
      }
      return true;
    }),
  ],
  registerUser
);

router.post(
  "/login",
  loginRateLimit,
  [
    body("email")
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be atleast 8 characters"),
  ],
  loginUser
);

router.post("/logout", verifyToken, logoutUser);

export default router;
