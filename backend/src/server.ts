import dotenv from "dotenv";

dotenv.config();
import path from "path";
import express from "express";
import cors from "cors";

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

const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:3000";

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

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDatabase();
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
