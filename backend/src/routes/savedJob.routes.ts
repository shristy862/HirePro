import express from "express";

import {
  saveJob,
  getSavedJobs,
  removeSavedJob,
} from "../controllers/savedjob.controller";

import { protect } from "../middleware/auth.middleware";

import { authorizeRoles } from "../middleware/role.middleware";

const router = express.Router();


// SAVE JOB
router.post(
  "/:jobId",
  protect,
  authorizeRoles("candidate"),
  saveJob
);


// GET SAVED JOBS
router.get(
  "/",
  protect,
  authorizeRoles("candidate"),
  getSavedJobs
);


// REMOVE SAVED JOB
router.delete(
  "/:jobId",
  protect,
  authorizeRoles("candidate"),
  removeSavedJob
);

export default router;