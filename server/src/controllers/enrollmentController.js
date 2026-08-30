import prisma from "../config/prisma.js";

// INSTRUCTOR ENROLLS A LEARNER
export const enrollLearner = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { learnerId } = req.body;

    if (!learnerId) {
      return res.status(400).json({
        success: false,
        message: "learnerId is required",
      });
    }

    // Check course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
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

    // Check learner
    const learner = await prisma.user.findUnique({
      where: { id: learnerId },
    });

    if (!learner || learner.role !== "LEARNER") {
      return res.status(404).json({
        success: false,
        message: "Learner not found",
      });
    }

    // Check duplicate enrollment
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        learnerId_courseId: {
          learnerId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: "Learner is already enrolled in this course",
      });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        learnerId,
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
          learnerId,
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Learner enrolled successfully",
      enrollment,
    });
  } catch (error) {
    console.error("Enroll learner error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to enroll learner",
    });
  }
};


// LEARNER SELF-ENROLLS
export const selfEnroll = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.status !== "PUBLISHED") {
      return res.status(400).json({
        success: false,
        message: "You can only enroll in published courses",
      });
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        learnerId_courseId: {
          learnerId: req.user.userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        learnerId: req.user.userId,
        courseId,
      },
    });

    await prisma.activityLog.create({
      data: {
        courseId,
        actorId: req.user.userId,
        action: "ENROLLED",
        entityType: "ENROLLMENT",
        entityId: enrollment.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Enrolled successfully",
      enrollment,
    });
  } catch (error) {
    console.error("Self enrollment error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to enroll",
    });
  }
};


// LEARNER GETS THEIR ENROLLED COURSES
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        learnerId: req.user.userId,
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            _count: {
              select: {
                lessons: true,
              },
            },
          },
        },
      },
      orderBy: {
        enrolledAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      enrollments,
    });
  } catch (error) {
    console.error("Get enrollments error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch enrollments",
    });
  }
};