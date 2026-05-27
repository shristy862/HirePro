import express from "express";

import {
  createJob,
  deleteJob,
  getAllJobs,
  getSingleJob,
  updateJob,
} from "../controllers/jobs.controller";

import { protect } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = express.Router();

// PUBLIC
router.get("/", getAllJobs);
router.get("/:id", getSingleJob);

// RECRUITER ONLY
router.post(
  "/create",
  protect,
  authorizeRoles("recruiter"),
  createJob
);

router.put(
  "/:id",
  protect,
  authorizeRoles("recruiter"),
  updateJob
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("recruiter"),
  deleteJob
);

export default router;
