import express from "express";

import {
  getAccountProfile,
  getMyProfile,
  updateProfile,
  uploadProfileAvatar,
} from "../controllers/profile.controller";

import { protect } from "../middleware/auth.middleware";

import { authorizeRoles } from "../middleware/role.middleware";

import { uploadAvatar } from "../middleware/upload.middleware";

const router = express.Router();

// ACCOUNT (RECRUITER + CANDIDATE)
router.get(
  "/account",
  protect,
  authorizeRoles("recruiter", "candidate"),
  getAccountProfile
);

// PROFILE PICTURE (RECRUITER + CANDIDATE)
router.post(
  "/avatar",
  protect,
  authorizeRoles("recruiter", "candidate"),
  uploadAvatar.single("avatar"),
  uploadProfileAvatar
);

// JOBSEEKER PROFILE
router.get(
  "/me",
  protect,
  authorizeRoles("candidate"),
  getMyProfile
);

// UPDATE PROFILE
router.put(
  "/update",
  protect,
  authorizeRoles("candidate"),
  updateProfile
);

export default router;
