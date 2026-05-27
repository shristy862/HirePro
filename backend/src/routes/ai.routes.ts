import express from "express";

import {
  analyzeResume,
} from "../controllers/ai.controller";

import { protect } from "../middleware/auth.middleware";

import { authorizeRoles } from "../middleware/role.middleware";

const router = express.Router();


// AI RESUME ANALYSIS
router.post(
  "/analyze-resume",
  protect,
  authorizeRoles("candidate"),
  analyzeResume
);

export default router;