import express from "express";

import {
  completeLesson,
  getCourseProgress,
} from "../controllers/progressController.js";

import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Learner completes a lesson
router.patch(
  "/lessons/:lessonId/complete",
  authenticate,
  authorize("LEARNER"),
  completeLesson
);

// Learner gets their progress for a course
router.get(
  "/courses/:courseId",
  authenticate,
  authorize("LEARNER"),
  getCourseProgress
);

export default router;