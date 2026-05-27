import express from "express";

import {
  uploadResume,
  getResume,
} from "../controllers/resume.controller";

import { protect } from "../middleware/auth.middleware";

import { authorizeRoles } from "../middleware/role.middleware";

import { upload } from "../middleware/upload.middleware";

const router = express.Router();


// UPLOAD RESUME
router.post(
  "/upload",
  protect,
  authorizeRoles("candidate"),
  upload.single("resume"),
  uploadResume
);


// GET RESUME
router.get(
  "/me",
  protect,
  authorizeRoles("candidate"),
  getResume
);

export default router;