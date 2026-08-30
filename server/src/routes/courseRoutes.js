import express from "express";

import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  publishCourse,
  archiveCourse,
  restoreCourse,
} from "../controllers/courseController.js";

import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Any authenticated user can view courses
router.get("/", authenticate, getCourses);

router.get("/:id", authenticate, getCourseById);

// Instructor only
router.post(
  "/",
  authenticate,
  authorize("INSTRUCTOR"),
  createCourse
);

router.put(
  "/:id",
  authenticate,
  authorize("INSTRUCTOR"),
  updateCourse
);

router.patch(
  "/:id/publish",
  authenticate,
  authorize("INSTRUCTOR"),
  publishCourse
);

router.patch(
  "/:id/archive",
  authenticate,
  authorize("INSTRUCTOR"),
  archiveCourse
);

router.patch(
  "/:id/restore",
  authenticate,
  authorize("INSTRUCTOR"),
  restoreCourse
);

export default router;