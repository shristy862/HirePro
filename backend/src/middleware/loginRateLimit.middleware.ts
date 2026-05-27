import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,

  message: {
    success: false,
    message:
      "Too many login attempts. Please wait 15 minutes before trying again.",
  },
});
// import rateLimit from "express-rate-limit";

// function getClientIpFromForwardedHeader(
//   forwarded: string | undefined
// ): string | null {
//   if (!forwarded) return null;
//   const match = forwarded.match(/for="?([^;,\s"]+)"?/i);
//   return match?.[1] ?? null;
// }

// export const loginRateLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   standardHeaders: true,
//   legacyHeaders: false,
//   skipSuccessfulRequests: true,
//   // Disable strict proxy-header checks in serverless environments.
//   validate: {
//     xForwardedForHeader: false,
//     forwardedHeader: false,
//   },
//   keyGenerator: (req) => {
//     const forwardedFor = req.headers["x-forwarded-for"]
//       ?.toString()
//       .split(",")[0]
//       ?.trim();

//     const forwarded = getClientIpFromForwardedHeader(
//       req.headers.forwarded?.toString()
//     );

//     return (
//       forwardedFor ||
//       forwarded ||
//       req.ip ||
//       req.socket.remoteAddress ||
//       "unknown"
//     );
//   },

//   message: {
//     success: false,
//     message:
//       "Too many login attempts. Please wait 15 minutes before trying again.",
//   },
// });