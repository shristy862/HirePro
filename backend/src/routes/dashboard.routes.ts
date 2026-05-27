import express from "express";

import {
  getCandidateDashboard,
  getRecruiterDashboard,
} from "../controllers/dashboard.controller";

import {
  protect,
} from "../middleware/auth.middleware";

import {
  authorizeRoles,
} from "../middleware/role.middleware";


const router =
  express.Router();


router.get(
  "/candidate",

  protect,

  authorizeRoles("candidate"),

  getCandidateDashboard
);


router.get(
  "/recruiter",

  protect,

  authorizeRoles("recruiter"),

  getRecruiterDashboard
);

export default router;