import express from "express";

import { getDashboard } from "../controllers/dashboardController.js";

import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Instructor dashboard
router.get(
  "/",
  authenticate,
  authorize("INSTRUCTOR"),
  getDashboard
);

export default router;