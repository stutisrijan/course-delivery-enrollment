import prisma from "../config/prisma.js";

// MARK A LESSON AS COMPLETED
export const completeLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    // Find the lesson and its course
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
      include: {
        course: true,
      },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    const learnerId = req.user.userId;

    // Check that learner is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        learnerId_courseId: {
          learnerId,
          courseId: lesson.courseId,
        },
      },
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You must be enrolled in this course",
      });
    }

    // Check existing progress
    const existingProgress = await prisma.lessonProgress.findUnique({
      where: {
        learnerId_lessonId: {
          learnerId,
          lessonId,
        },
      },
    });

    // If already completed, don't create another record
    if (existingProgress?.completed) {
      return res.status(400).json({
        success: false,
        message: "Lesson is already completed",
      });
    }

    // Create or update progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        learnerId_lessonId: {
          learnerId,
          lessonId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        learnerId,
        lessonId,
        completed: true,
        completedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Lesson completed successfully",
      progress,
    });
  } catch (error) {
    console.error("Complete lesson error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update lesson progress",
    });
  }
};

// GET LEARNER'S PROGRESS FOR A COURSE
export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const learnerId = req.user.userId;

    // Check course exists
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

    // Check learner is enrolled
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        learnerId_courseId: {
          learnerId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You must be enrolled in this course",
      });
    }

    // Get total lessons
    const totalLessons = await prisma.lesson.count({
      where: {
        courseId,
      },
    });

    // Get completed lessons
    const completedLessons = await prisma.lessonProgress.count({
      where: {
        learnerId,
        completed: true,
        lesson: {
          courseId,
        },
      },
    });

    // Determine progress state
    let state = "NOT_STARTED";

    if (completedLessons === totalLessons && totalLessons > 0) {
      state = "COMPLETED";
    } else if (completedLessons > 0) {
      state = "IN_PROGRESS";
    }

    const percentage =
      totalLessons === 0
        ? 0
        : Math.round((completedLessons / totalLessons) * 100);

    return res.status(200).json({
      success: true,
      progress: {
        courseId,
        totalLessons,
        completedLessons,
        percentage,
        state,
      },
    });
  } catch (error) {
    console.error("Get course progress error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch course progress",
    });
  }
};