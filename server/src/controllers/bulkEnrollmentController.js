import prisma from "../config/prisma.js";

// BULK ENROLL LEARNERS BY EMAIL
export const bulkEnrollLearners = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { emails } = req.body;

    // Validate emails array
    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "emails must be a non-empty array",
      });
    }

    // Check course
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Only published courses can have enrollments
    if (course.status !== "PUBLISHED") {
      return res.status(400).json({
        success: false,
        message: "Learners can only be enrolled in published courses",
      });
    }

    // Instructor can only manage their own course
    if (course.instructorId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only enroll learners in your own courses",
      });
    }

    // Clean and remove duplicate emails
    const cleanedEmails = [
      ...new Set(
        emails
          .filter((email) => typeof email === "string")
          .map((email) => email.trim().toLowerCase())
          .filter(Boolean)
      ),
    ];

    const results = [];

    for (const email of cleanedEmails) {
      // Find learner by email
      const learner = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      // Unknown email
      if (!learner || learner.role !== "LEARNER") {
        results.push({
          email,
          status: "UNKNOWN",
        });

        continue;
      }

      // Check existing enrollment
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          learnerId_courseId: {
            learnerId: learner.id,
            courseId,
          },
        },
      });

      // Already enrolled
      if (existingEnrollment) {
        results.push({
          email,
          learnerId: learner.id,
          status: "ALREADY_ENROLLED",
        });

        continue;
      }

      // Create enrollment
      const enrollment = await prisma.enrollment.create({
        data: {
          learnerId: learner.id,
          courseId,
        },
      });

      // Activity log
      await prisma.activityLog.create({
        data: {
          courseId,
          actorId: req.user.userId,
          action: "ENROLLED",
          entityType: "ENROLLMENT",
          entityId: enrollment.id,
          metadata: {
            learnerId: learner.id,
            email,
            bulk: true,
          },
        },
      });

      results.push({
        email,
        learnerId: learner.id,
        status: "NEWLY_ENROLLED",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bulk enrollment processed successfully",
      results,
    });
  } catch (error) {
    console.error("Bulk enrollment error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process bulk enrollment",
    });
  }
};


// EXPORT COURSE PROGRESS AS CSV
export const exportCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check course
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Instructor can only export their own course
    if (course.instructorId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only export progress for your own courses",
      });
    }

    // Get all lessons in the course
    const lessons = await prisma.lesson.findMany({
      where: {
        courseId,
      },
      select: {
        id: true,
      },
    });

    const totalLessons = lessons.length;

    // Get all enrollments with learner information
    const enrollments = await prisma.enrollment.findMany({
      where: {
        courseId,
      },
      include: {
        learner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        enrolledAt: "asc",
      },
    });

    // Get completed lesson progress
    const progressRecords = await prisma.lessonProgress.findMany({
      where: {
        learnerId: {
          in: enrollments.map((enrollment) => enrollment.learnerId),
        },
        lessonId: {
          in: lessons.map((lesson) => lesson.id),
        },
        completed: true,
      },
      select: {
        learnerId: true,
        lessonId: true,
      },
    });

    // Count completed lessons for each learner
    const completedMap = new Map();

    for (const record of progressRecords) {
      const currentCount = completedMap.get(record.learnerId) || 0;
      completedMap.set(record.learnerId, currentCount + 1);
    }

    // Create CSV rows
    const rows = enrollments.map((enrollment) => {
      const completedLessons =
        completedMap.get(enrollment.learnerId) || 0;

      let percentage = 0;

      if (totalLessons > 0) {
        percentage = Math.round(
          (completedLessons / totalLessons) * 100
        );
      }

      let state = "NOT_STARTED";

      if (completedLessons > 0 && completedLessons < totalLessons) {
        state = "IN_PROGRESS";
      } else if (
        totalLessons > 0 &&
        completedLessons === totalLessons
      ) {
        state = "COMPLETED";
      }

      return {
        name: enrollment.learner.name,
        email: enrollment.learner.email,
        totalLessons,
        completedLessons,
        percentage,
        state,
      };
    });

    // CSV header
    const csvRows = [
      [
        "Learner Name",
        "Email",
        "Course",
        "Total Lessons",
        "Completed Lessons",
        "Progress %",
        "State",
      ].join(","),
    ];

    // CSV data
    for (const row of rows) {
      const csvRow = [
        `"${String(row.name || "").replace(/"/g, '""')}"`,
        `"${String(row.email || "").replace(/"/g, '""')}"`,
        `"${String(course.title || "").replace(/"/g, '""')}"`,
        row.totalLessons,
        row.completedLessons,
        row.percentage,
        row.state,
      ].join(",");

      csvRows.push(csvRow);
    }

    const csv = csvRows.join("\n");

    // Tell browser/client this is a CSV file
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${course.title.replace(/[^a-z0-9]/gi, "_")}_progress.csv"`
    );

    return res.status(200).send(csv);
  } catch (error) {
    console.error("Export course progress error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to export course progress",
    });
  }
};