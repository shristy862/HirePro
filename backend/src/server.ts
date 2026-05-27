import dotenv from "dotenv";
dotenv.config();

import path from "path";
import express from "express";
import cors from "cors";
import type { NextFunction, Request, Response } from "express";

import authRoutes from "./routes/auth.routes";
import { connectDatabase } from "./lib/db";
import jobRoutes from "./routes/jobs.routes";
import applicationRoutes from "./routes/application.routes";
import profileRoutes from "./routes/profile.routes";
import savedJobRoutes from "./routes/savedJob.routes";
import resumeRoutes from "./routes/resume.routes";
import aiRoutes from "./routes/ai.routes";
import dashboardRoutes from "./routes/dashboard.routes";

const app = express();

app.set("trust proxy", true);

const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

// --------------------
// DB CONNECTION MIDDLEWARE (IMPORTANT FIX)
// --------------------
const ensureDBConnection = async () => {
  await connectDatabase();
};

// attach middleware BEFORE routes
app.use(async (_req, _res, next) => {
  try {
    await ensureDBConnection();
    next();
  } catch (_err) {
    next(new Error("DB_NOT_READY"));
  }
});

// -------------------- ROUTES --------------------

app.get("/", (_req, res) => {
  res.send("API running...");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/saved-jobs", savedJobRoutes);
app.use("/api/v1/resume", resumeRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.use(
  (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    if (err.message === "DB_NOT_READY") {
      return res.status(503).json({
        success: false,
        message:
          "Database connection is initializing. Please retry in a few seconds.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);

export default app;