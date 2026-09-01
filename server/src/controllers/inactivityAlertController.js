import prisma from "../config/prisma.js";

// GET INACTIVITY ALERTS FOR INSTRUCTOR
export const getInactivityAlerts = async (req, res) => {
  try {
    const now = new Date();

    const fourteenDaysAgo = new Date(
      now.getTime() - 14 * 24 * 60 * 60 * 1000
    );

    const courses = await prisma.course.findMany({
      where: {
        instructorId: req.user.userId,
      },
      include: {
        enrollments: {
          include: {
            learner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        lessons: {
          select: {
            id: true,
          },
        },
      },
    });

    const alerts = [];

    for (const course of courses) {
      const lessonIds = course.lessons.map((lesson) => lesson.id);

      if (lessonIds.length === 0) continue;

      for (const enrollment of course.enrollments) {
        const completedLessons = await prisma.lessonProgress.count({
          where: {
            learnerId: enrollment.learnerId,
            lessonId: {
              in: lessonIds,
            },
            completed: true,
          },
        });

        // Must be IN PROGRESS
        if (
          completedLessons === 0 ||
          completedLessons >= lessonIds.length
        ) {
          continue;
        }

        const lastProgress = await prisma.lessonProgress.findFirst({
          where: {
            learnerId: enrollment.learnerId,
            lessonId: {
              in: lessonIds,
            },
            completed: true,
          },
          orderBy: {
            completedAt: "desc",
          },
        });

        if (!lastProgress?.completedAt) continue;

        // Not inactive yet
        if (lastProgress.completedAt >= fourteenDaysAgo) {
          continue;
        }

        // Find existing alert
        let alert = await prisma.inactivityAlert.findFirst({
          where: {
            learnerId: enrollment.learnerId,
            courseId: course.id,
          },
        });

        if (alert) {
          // Learner made progress after previous alert
          if (lastProgress.completedAt > alert.lastProgressAt) {
            alert = await prisma.inactivityAlert.update({
              where: {
                id: alert.id,
              },
              data: {
                lastProgressAt: lastProgress.completedAt,
                dismissedAt: null,
              },
            });
          }
        } else {
          // Create new alert
          alert = await prisma.inactivityAlert.create({
            data: {
              learnerId: enrollment.learnerId,
              courseId: course.id,
              lastProgressAt: lastProgress.completedAt,
            },
          });
        }

        // Do not show dismissed alerts unless learner
        // has made new progress
        if (alert.dismissedAt) {
          continue;
        }

        alerts.push({
          id: alert.id,
          learnerId: enrollment.learnerId,
          learnerName: enrollment.learner.name,
          learnerEmail: enrollment.learner.email,
          courseId: course.id,
          courseTitle: course.title,
          lastProgressAt: alert.lastProgressAt,
          daysInactive: Math.floor(
            (now - alert.lastProgressAt) /
              (1000 * 60 * 60 * 24)
          ),
        });
      }
    }

    return res.status(200).json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    console.error("Get inactivity alerts error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch inactivity alerts",
    });
  }
};


// DISMISS INACTIVITY ALERT
export const dismissInactivityAlert = async (req, res) => {
  try {
    const { learnerId, courseId } = req.params;

    // Verify course belongs to logged-in instructor
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: req.user.userId,
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const alert = await prisma.inactivityAlert.findFirst({
      where: {
        learnerId,
        courseId,
      },
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Inactivity alert not found",
      });
    }

    const dismissedAlert = await prisma.inactivityAlert.update({
      where: {
        id: alert.id,
      },
      data: {
        dismissedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Inactivity alert dismissed",
      alert: dismissedAlert,
    });
  } catch (error) {
    console.error("Dismiss inactivity alert error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to dismiss inactivity alert",
    });
  }
};