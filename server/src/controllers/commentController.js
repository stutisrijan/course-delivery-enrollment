import prisma from "../config/prisma.js";

// ADD COMMENT TO A COURSE
export const addCourseComment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { comment } = req.body;

    // Validate comment
    if (!comment || typeof comment !== "string" || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment is required",
      });
    }

    const cleanComment = comment.trim();

    // Check course
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        enrollments: {
          where: {
            learnerId: req.user.userId,
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Instructor must own the course
    if (
      req.user.role === "INSTRUCTOR" &&
      course.instructorId !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only comment on your own courses",
      });
    }

    // Learner must be enrolled
    if (req.user.role === "LEARNER" && course.enrollments.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You must be enrolled in this course to comment",
      });
    }

    // Create immutable activity log
    const activity = await prisma.activityLog.create({
      data: {
        courseId,
        actorId: req.user.userId,
        action: "COMMENTED",
        entityType: "COURSE_COMMENT",
        entityId: courseId,
        comment: cleanComment,
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
    });

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      activity,
    });
  } catch (error) {
    console.error("Add course comment error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to add comment",
    });
  }
};