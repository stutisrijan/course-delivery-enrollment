import prisma from "../config/prisma.js";

// CREATE COURSE
export const createCourse = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, description and category are required",
      });
    }

    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        instructorId: req.user.userId,
      },
    });

    await prisma.activityLog.create({
      data: {
        courseId: course.id,
        actorId: req.user.userId,
        action: "CREATED",
        entityType: "COURSE",
        entityId: course.id,
        comment: null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create course",
    });
  }
};


// GET ALL COURSES
export const getCourses = async (req, res) => {
  try {
    const {
      search,
      category,
      status,
      instructorId,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const pageNumber = Math.max(parseInt(page) || 1, 1);
    const limitNumber = Math.min(
      Math.max(parseInt(limit) || 10, 1),
      100
    );

    const where = {};

    // Learners can ONLY see published courses
    if (req.user.role === "LEARNER") {
      where.status = "PUBLISHED";
    } else {
      // Instructors can see all courses
      if (status) {
        where.status = status;
      }
    }

    // Category filter
    if (category) {
      where.category = category;
    }

    // Instructor filter
    if (instructorId) {
      where.instructorId = instructorId;
    }

    // Search title + description
    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const actualSortOrder = sortOrder === "asc" ? "asc" : "desc";

    /*
     * enrollmentCount sorting cannot use Prisma's _count inside
     * orderBy with the current Prisma Client version.
     *
     * So for enrollmentCount:
     * 1. Fetch matching courses on the server.
     * 2. Sort them on the server.
     * 3. Apply pagination on the server.
     *
     * Nothing is sent to the browser before pagination.
     */
    if (sortBy === "enrollmentCount") {
      const courses = await prisma.course.findMany({
        where,
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
              enrollments: true,
              lessons: true,
            },
          },
        },
      });

      courses.sort((a, b) => {
        const countA = a._count.enrollments;
        const countB = b._count.enrollments;

        if (actualSortOrder === "asc") {
          return countA - countB;
        }

        return countB - countA;
      });

      const total = courses.length;

      const skip = (pageNumber - 1) * limitNumber;

      const paginatedCourses = courses.slice(
        skip,
        skip + limitNumber
      );

      return res.status(200).json({
        success: true,
        courses: paginatedCourses,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,
          totalPages: Math.ceil(total / limitNumber),
        },
      });
    }

    // Pagination for normal database sorting
    const skip = (pageNumber - 1) * limitNumber;

    let orderBy;

    if (sortBy === "title") {
      orderBy = {
        title: actualSortOrder,
      };
    } else {
      // Default sorting by creation date
      orderBy = {
        createdAt: actualSortOrder,
      };
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy,
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
              enrollments: true,
              lessons: true,
            },
          },
        },
      }),

      prisma.course.count({
        where,
      }),
    ]);

    return res.status(200).json({
      success: true,
      courses,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error("Get courses error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch courses",
    });
  }
};


// GET ONE COURSE WITH LESSONS
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: {
        id,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        lessons: {
          orderBy: {
            position: "asc",
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

    // Learners cannot view drafts or archived courses
    if (
      req.user.role === "LEARNER" &&
      course.status !== "PUBLISHED"
    ) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Get course error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch course",
    });
  }
};


// UPDATE COURSE
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, comment } = req.body;

    const course = await prisma.course.findUnique({
      where: { id },
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
        message: "You can only edit your own courses",
      });
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        ...(title !== undefined && {
          title: title.trim(),
        }),
        ...(description !== undefined && {
          description: description.trim(),
        }),
        ...(category !== undefined && {
          category: category.trim(),
        }),
      },
    });

    await prisma.activityLog.create({
      data: {
        courseId: id,
        actorId: req.user.userId,
        action: "UPDATED",
        entityType: "COURSE",
        entityId: id,
        comment: comment || null,
        metadata: {
          titleChanged: title !== undefined,
          descriptionChanged: description !== undefined,
          categoryChanged: category !== undefined,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Update course error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update course",
    });
  }
};


// PUBLISH COURSE
export const publishCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            lessons: true,
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

    if (course.instructorId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only publish your own courses",
      });
    }

    // Empty courses cannot be published
    if (course._count.lessons === 0) {
      return res.status(400).json({
        success: false,
        message: "Course cannot be published because it has no lessons",
      });
    }

    if (course.status !== "DRAFT") {
      return res.status(400).json({
        success: false,
        message: "Only draft courses can be published",
      });
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        status: "PUBLISHED",
      },
    });

    await prisma.activityLog.create({
      data: {
        courseId: id,
        actorId: req.user.userId,
        action: "PUBLISHED",
        entityType: "COURSE",
        entityId: id,
        comment: comment || null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Course published successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Publish course error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to publish course",
    });
  }
};


// ARCHIVE COURSE
export const archiveCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const course = await prisma.course.findUnique({
      where: { id },
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
        message: "You can only archive your own courses",
      });
    }

    if (course.status !== "PUBLISHED") {
      return res.status(400).json({
        success: false,
        message: "Only published courses can be archived",
      });
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        status: "ARCHIVED",
      },
    });

    await prisma.activityLog.create({
      data: {
        courseId: id,
        actorId: req.user.userId,
        action: "ARCHIVED",
        entityType: "COURSE",
        entityId: id,
        comment: comment || null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Course archived successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Archive course error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to archive course",
    });
  }
};


// RESTORE COURSE
export const restoreCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const course = await prisma.course.findUnique({
      where: { id },
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
        message: "You can only restore your own courses",
      });
    }

    if (course.status !== "ARCHIVED") {
      return res.status(400).json({
        success: false,
        message: "Only archived courses can be restored",
      });
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        status: "PUBLISHED",
      },
    });

    await prisma.activityLog.create({
      data: {
        courseId: id,
        actorId: req.user.userId,
        action: "RESTORED",
        entityType: "COURSE",
        entityId: id,
        comment: comment || null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Course restored successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Restore course error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to restore course",
    });
  }
};