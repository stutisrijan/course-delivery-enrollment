import express from "express";

import {
  enrollLearner,
  selfEnroll,
  getMyEnrollments,
} from "../controllers/enrollmentController.js";

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