import prisma from "../config/prisma.js";

// CREATE LESSON
export const createLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    // Check that course exists and belongs to logged-in instructor
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

    if (course.instructorId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only manage lessons in your own courses",
      });
    }

    // Find the next position
    const lastLesson = await prisma.lesson.findFirst({
      where: {
        courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const position = lastLesson ? lastLesson.position + 1 : 1;

    const lesson = await prisma.lesson.create({
      data: {
        courseId,
        title: title.trim(),
        content: content.trim(),
        position,
      },
    });

    // Activity log
    await prisma.activityLog.create({
      data: {
        courseId,
        actorId: req.user.userId,
        action: "CREATED",
        entityType: "LESSON",
        entityId: lesson.id,
        metadata: {
          title: lesson.title,
          position: lesson.position,
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      lesson,
    });
  } catch (error) {
    console.error("Create lesson error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create lesson",
    });
  }
};


// GET LESSONS FOR A COURSE
export const getCourseLessons = async (req, res) => {
  try {
    const { courseId } = req.params;

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

    const lessons = await prisma.lesson.findMany({
      where: {
        courseId,
      },
      orderBy: {
        position: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      lessons,
    });
  } catch (error) {
    console.error("Get lessons error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch lessons",
    });
  }
};


// UPDATE LESSON
export const updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { title, content } = req.body;

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

    if (lesson.course.instructorId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only edit lessons in your own courses",
      });
    }

    if (!title && !content) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    const updatedLesson = await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(content !== undefined && { content: content.trim() }),
      },
    });

    await prisma.activityLog.create({
      data: {
        courseId: lesson.courseId,
        actorId: req.user.userId,
        action: "UPDATED",
        entityType: "LESSON",
        entityId: lesson.id,
        metadata: {
          title: updatedLesson.title,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      lesson: updatedLesson,
    });
  } catch (error) {
    console.error("Update lesson error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update lesson",
    });
  }
};


// DELETE LESSON
export const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

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

    if (lesson.course.instructorId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete lessons in your own courses",
      });
    }

    await prisma.lesson.delete({
      where: {
        id: lessonId,
      },
    });

    // Shift positions of lessons after deleted lesson
    await prisma.lesson.updateMany({
      where: {
        courseId: lesson.courseId,
        position: {
          gt: lesson.position,
        },
      },
      data: {
        position: {
          decrement: 1,
        },
      },
    });

    await prisma.activityLog.create({
      data: {
        courseId: lesson.courseId,
        actorId: req.user.userId,
        action: "DELETED",
        entityType: "LESSON",
        entityId: lesson.id,
        metadata: {
          title: lesson.title,
          position: lesson.position,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    console.error("Delete lesson error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete lesson",
    });
  }
};
export const reorderLessons = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonIds } = req.body;

    if (!Array.isArray(lessonIds) || lessonIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "lessonIds must be a non-empty array",
      });
    }

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

    if (course.instructorId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only reorder lessons in your own courses",
      });
    }

    const lessons = await prisma.lesson.findMany({
      where: {
        courseId,
      },
    });

    const existingIds = new Set(lessons.map((lesson) => lesson.id));

    if (
  lessonIds.length !== lessons.length ||
  new Set(lessonIds).size !== lessonIds.length ||
  lessonIds.some((id) => !existingIds.has(id))
) {
  return res.status(400).json({
    success: false,
    message:
      "lessonIds must contain every lesson in this course exactly once",
  });
}

    await prisma.$transaction(
      lessonIds.map((lessonId, index) =>
        prisma.lesson.update({
          where: {
            id: lessonId,
          },
          data: {
            position: index + 1,
          },
        })
      )
    );

    await prisma.activityLog.create({
      data: {
        courseId,
        actorId: req.user.userId,
        action: "REORDERED",
        entityType: "LESSON",
        entityId: lessonIds[0],
        metadata: {
          lessonIds,
        },
      },
    });

    const updatedLessons = await prisma.lesson.findMany({
      where: {
        courseId,
      },
      orderBy: {
        position: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Lessons reordered successfully",
      lessons: updatedLessons,
    });
  } catch (error) {
    console.error("Reorder lessons error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reorder lessons",
    });
  }
};