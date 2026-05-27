import rateLimit from "express-rate-limit";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export const loginRateLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_ATTEMPTS,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,

  // 🔥 IMPORTANT FIX FOR VERCEL
  keyGenerator: (req) => {
    return (
      req.ip ||
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      "unknown-ip"
    );
  },

  message: {
    success: false,
    message:
      "Too many login attempts. Please wait 15 minutes before trying again.",
  },
});