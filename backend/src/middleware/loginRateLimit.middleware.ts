import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  // In proxy setups (Vercel), rely on Express `req.ip` + trust proxy.
  // Disable strict header validation checks that can throw in serverless edges.
  validate: false,
  keyGenerator: (req) => req.ip ?? req.socket.remoteAddress ?? "unknown",

  message: {
    success: false,
    message:
      "Too many login attempts. Please wait 15 minutes before trying again.",
  },
});