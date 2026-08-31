import express from "express";

import { getCourseActivity } from "../controllers/activityController.js";

import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Instructor views activity history of their course
router.get(
  "/courses/:courseId/activity",
  authenticate,
  authorize("INSTRUCTOR"),
  getCourseActivity
);

export default router;