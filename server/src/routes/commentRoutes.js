import express from "express";

import { addCourseComment } from "../controllers/commentController.js";

import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Instructor and learner can comment
router.post(
  "/courses/:courseId/comments",
  authenticate,
  authorize("INSTRUCTOR", "LEARNER"),
  addCourseComment
);

export default router;