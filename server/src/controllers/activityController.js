import prisma from "../config/prisma.js";

// GET ACTIVITY HISTORY FOR A COURSE
export const getCourseActivity = async (req, res) => {
  try {
    const { courseId } = req.params;

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

    // Only the instructor who owns the course can view its history
    if (course.instructorId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only view activity history for your own courses",
      });
    }

    const activities = await prisma.activityLog.findMany({
      where: {
        courseId,
      },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      courseId,
      activities,
    });
  } catch (error) {
    console.error("Get course activity error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch course activity history",
    });
  }
};