import express from "express";

import {
  applyJob,
  getJobApplicants,
  getMyApplications,
  getRecruiterApplicationById,
  getRecruiterApplications,
  updateApplicationStatus,
} from "../controllers/application.controller";

import { protect } from "../middleware/auth.middleware";

import { authorizeRoles } from "../middleware/role.middleware";

const router = express.Router();


// JOBSEEKER APPLY
router.post(
  "/apply/:id",
  protect,
  authorizeRoles("candidate"),
  applyJob
);


// JOBSEEKER APPLICATIONS
router.get(
  "/my-applications",
  protect,
  authorizeRoles("candidate"),
  getMyApplications
);


// RECRUITER VIEW JOB APPLICANTS
router.get(
  "/job/:id/applicants",
  protect,
  authorizeRoles("recruiter"),
  getJobApplicants
);


// RECRUITER ALL APPLICATIONS
router.get(
  "/recruiter/all",
  protect,
  authorizeRoles("recruiter"),
  getRecruiterApplications
);


// RECRUITER SINGLE APPLICATION
router.get(
  "/recruiter/:id",
  protect,
  authorizeRoles("recruiter"),
  getRecruiterApplicationById
);


// UPDATE STATUS
router.put(
  "/status/:applicationId",
  protect,
  authorizeRoles("recruiter"),
  updateApplicationStatus
);

export default router;