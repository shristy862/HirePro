import express from "express";

import {
  applyJob,
  getMyApplications,
  getSingleApplication,
  withdrawApplication,
} from "../controllers/candidateApplication.controller";

import {
  protect,
} from "../middleware/auth.middleware";

import {
  authorizeRoles,
} from "../middleware/role.middleware";


const router =
  express.Router();


// APPLY JOB
router.post(
  "/apply",

  protect,

  authorizeRoles("candidate"),

  applyJob
);


// GET MY APPLICATIONS
router.get(
  "/my-applications",

  protect,

  authorizeRoles("candidate"),

  getMyApplications
);


// GET SINGLE APPLICATION
router.get(
  "/:id",

  protect,

  authorizeRoles("candidate"),

  getSingleApplication
);


// WITHDRAW APPLICATION
router.delete(
  "/:id",

  protect,

  authorizeRoles("candidate"),

  withdrawApplication
);


export default router;