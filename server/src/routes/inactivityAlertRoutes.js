import express from "express";

import {
  getInactivityAlerts,
  dismissInactivityAlert,
} from "../controllers/inactivityAlertController.js";

import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Get inactivity alerts
router.get(
  "/",
  authenticate,
  authorize("INSTRUCTOR"),
  getInactivityAlerts
);

// Dismiss an inactivity alert
router.patch(
  "/:learnerId/:courseId/dismiss",
  authenticate,
  authorize("INSTRUCTOR"),
  dismissInactivityAlert
);

export default router;