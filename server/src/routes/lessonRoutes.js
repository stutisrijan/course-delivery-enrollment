import express from "express";

import {
  createLesson,
  getCourseLessons,
  updateLesson,
  deleteLesson,
  reorderLessons,
} from "../controllers/lessonController.js";

import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/courses/:courseId/lessons",
  authenticate,
  authorize("INSTRUCTOR"),
  createLesson
);

router.get(
  "/courses/:courseId/lessons",
  authenticate,
  getCourseLessons
);

router.put(
  "/lessons/:lessonId",
  authenticate,
  authorize("INSTRUCTOR"),
  updateLesson
);

router.delete(
  "/lessons/:lessonId",
  authenticate,
  authorize("INSTRUCTOR"),
  deleteLesson
);
router.patch(
  "/courses/:courseId/lessons/reorder",
  authenticate,
  authorize("INSTRUCTOR"),
  reorderLessons
);

export default router;