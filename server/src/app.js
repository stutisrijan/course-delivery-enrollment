import express from "express";
import cors from "cors";
import prisma from "./config/prisma.js";
import authRoutes from "./routes/authRoutes.js";
import { authenticate, authorize } from "./middleware/authMiddleware.js";
import courseRoutes from "./routes/courseRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import inactivityAlertRoutes from "./routes/inactivityAlertRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/courses", courseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", lessonRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", activityRoutes);
app.use("/api", commentRoutes);
app.use("/api/inactivity-alerts", inactivityAlertRoutes);
// Temporary authentication test
app.get(
  "/api/test/instructor",
  authenticate,
  authorize("INSTRUCTOR"),
  (req, res) => {
    res.json({
      success: true,
      message: "Instructor access granted",
      user: req.user,
    });
  }
);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Course Delivery & Enrollment API is running",
  });
});

app.get("/api/health/db", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      message: "Database connection is working",
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

export default app;