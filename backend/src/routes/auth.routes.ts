import express from "express";

import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/auth.controller";

import { protect } from "../middleware/auth.middleware";
import { loginRateLimiter } from "../middleware/loginRateLimit.middleware";

const router = express.Router();


// PUBLIC ROUTES
router.post("/register", registerUser);

router.post("/login", loginRateLimiter, loginUser);


// PRIVATE ROUTE
router.get("/me", protect, getMe);

export default router;