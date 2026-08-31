import express from "express";

import {
  enrollLearner,
  selfEnroll,
  getMyEnrollments,
} from "../controllers/enrollmentController.js";

import {
  bulkEnrollLearners,
  exportCourseProgress,
} from "../controllers/bulkEnrollmentController.js";

import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Instructor enrolls a learner
router.post(
  "/courses/:courseId/enroll",
  authenticate,
  authorize("INSTRUCTOR"),
  enrollLearner
);

// Instructor bulk enrolls learners
router.post(
  "/courses/:courseId/enroll/bulk",
  authenticate,
  authorize("INSTRUCTOR"),
  bulkEnrollLearners
);

// Instructor exports course progress as CSV
router.get(
  "/courses/:courseId/progress/export",
  authenticate,
  authorize("INSTRUCTOR"),
  exportCourseProgress
);

// Learner enrolls themselves
router.post(
  "/courses/:courseId/self-enroll",
  authenticate,
  authorize("LEARNER"),
  selfEnroll
);

// Learner sees their enrolled courses
router.get(
  "/my",
  authenticate,
  authorize("LEARNER"),
  getMyEnrollments
);

export default router;