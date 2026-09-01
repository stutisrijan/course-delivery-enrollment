import prisma from "../config/prisma.js";

// GET INSTRUCTOR DASHBOARD
export const getDashboard = async (req, res) => {
  try {
    // ---------------------------------------
    // 1. HEADLINE STATISTICS
    // ---------------------------------------

    const publishedCourses = await prisma.course.count({
      where: {
        status: "PUBLISHED",
        instructorId: req.user.userId,
      },
    });

    // ---------------------------------------
    // 2. GET ENROLLMENTS
    // ---------------------------------------

    const enrollments = await prisma.enrollment.findMany({
      where: {
        course: {
          instructorId: req.user.userId,
        },
      },
      include: {
        course: {
          include: {
            lessons: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    const totalLearners = new Set(enrollments.map((enrollment) => enrollment.learnerId)).size;
    let completionsThisMonth = 0;

    // Unique learners currently in progress
    const inProgressLearners = new Set();

    // Overall progress state counters
    let notStarted = 0;
    let inProgress = 0;
    let completed = 0;

    // Course-wise breakdown
    const courseBreakdown = {};

    // Last 8 weeks completion data
    const weeklyCompletions = [];

    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    // ---------------------------------------
    // 3. CREATE LAST 8 WEEKS
    // ---------------------------------------

    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - i * 7);
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      weeklyCompletions.push({
        weekStart: weekStart.toISOString(),
        weekEnd: weekEnd.toISOString(),
        completions: 0,
      });
    }

    // ---------------------------------------
    // 4. CALCULATE PROGRESS
    // ---------------------------------------

    for (const enrollment of enrollments) {
      const lessonIds = enrollment.course.lessons.map(
        (lesson) => lesson.id
      );

      const totalLessons = lessonIds.length;

      // Initialize course breakdown
      if (!courseBreakdown[enrollment.course.id]) {
        courseBreakdown[enrollment.course.id] = {
          courseId: enrollment.course.id,
          courseTitle: enrollment.course.title,
          enrollments: 0,
          notStarted: 0,
          inProgress: 0,
          completed: 0,
        };
      }

      courseBreakdown[enrollment.course.id].enrollments++;

      // ---------------------------------------
      // COURSE WITH NO LESSONS
      // ---------------------------------------

      if (totalLessons === 0) {
        notStarted++;

        courseBreakdown[enrollment.course.id].notStarted++;

        continue;
      }

      // ---------------------------------------
      // COUNT COMPLETED LESSONS
      // ---------------------------------------

      const completedProgress = await prisma.lessonProgress.findMany({
        where: {
          learnerId: enrollment.learnerId,
          lessonId: {
            in: lessonIds,
          },
          completed: true,
        },
        select: {
          completedAt: true,
        },
      });

      const completedLessons = completedProgress.length;

      // ---------------------------------------
      // NOT STARTED
      // ---------------------------------------

      if (completedLessons === 0) {
        notStarted++;

        courseBreakdown[enrollment.course.id].notStarted++;
      }

      // ---------------------------------------
      // IN PROGRESS
      // ---------------------------------------

      else if (completedLessons < totalLessons) {
        inProgress++;

        inProgressLearners.add(enrollment.learnerId);

        courseBreakdown[enrollment.course.id].inProgress++;
      }

      // ---------------------------------------
      // COMPLETED
      // ---------------------------------------

      else {
        completed++;

        courseBreakdown[enrollment.course.id].completed++;

        // Find the final lesson completion
        const lastCompletedLesson =
          await prisma.lessonProgress.findFirst({
            where: {
              learnerId: enrollment.learnerId,
              lessonId: {
                in: lessonIds,
              },
              completed: true,
              completedAt: {
                not: null,
              },
            },
            orderBy: {
              completedAt: "desc",
            },
          });

        if (lastCompletedLesson?.completedAt) {
          // Completion this month
          if (lastCompletedLesson.completedAt >= startOfMonth) {
            completionsThisMonth++;
          }

          // ---------------------------------------
          // ADD TO 8-WEEK COMPLETION CHART
          // ---------------------------------------

          for (const week of weeklyCompletions) {
            const completionDate = lastCompletedLesson.completedAt;

            const weekStart = new Date(week.weekStart);
            const weekEnd = new Date(week.weekEnd);

            if (
              completionDate >= weekStart &&
              completionDate < weekEnd
            ) {
              week.completions++;
              break;
            }
          }
        }
      }
    }

    // ---------------------------------------
    // 5. FINAL DASHBOARD DATA
    // ---------------------------------------

    const learnersInProgress = inProgressLearners.size;

    return res.status(200).json({
      success: true,

      dashboard: {
        // Headline statistics
        totalLearners,
        publishedCourses,
        completionsThisMonth,
        learnersInProgress,

        // Progress state breakdown
        progressBreakdown: {
          notStarted,
          inProgress,
          completed,
        },

        // Enrollment breakdown by course
        courseBreakdown: Object.values(courseBreakdown),

        // Last 8 weeks completion chart
        weeklyCompletions,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch dashboard",
    });
  }
};
