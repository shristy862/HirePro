import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,

  //  IMPORTANT FIX FOR VERCEL + NEW express-rate-limit
  validate: {
    xForwardedForHeader: false,
    forwardedHeader: false,
  },

  keyGenerator: (req) => {
    return (
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      req.socket.remoteAddress ||
      "unknown"
    );
  },

  message: {
    success: false,
    message:
      "Too many login attempts. Please wait 15 minutes before trying again.",
  },
});