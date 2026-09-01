import bcrypt from "bcryptjs";
import prisma from "./src/config/prisma.js";

async function main() {
  console.log("🧹 Clearing old data...");

  await prisma.inactivityAlert.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Old data cleared");

  // =========================
  // PASSWORD
  // =========================

  const passwordHash = await bcrypt.hash("Test@123", 12);

  // =========================
  // USERS
  // =========================

  const instructor = await prisma.user.create({
    data: {
      name: "Test Instructor",
      email: "instructor@test.com",
      passwordHash,
      role: "INSTRUCTOR",
    },
  });

  const learner = await prisma.user.create({
    data: {
      name: "Test Learner",
      email: "learner@test.com",
      passwordHash,
      role: "LEARNER",
    },
  });

  console.log("👨‍🏫 Instructor:", instructor.email);
  console.log("👨‍🎓 Learner:", learner.email);

  // =========================
  // COURSE
  // =========================

  const course = await prisma.course.create({
    data: {
      title: "Introduction to Programming",
      description:
        "Learn the fundamentals of programming, algorithms and problem solving.",
      category: "Programming",
      status: "PUBLISHED",
      instructorId: instructor.id,
    },
  });

  console.log("📚 Course created:", course.title);

  // =========================
  // LESSONS
  // =========================

  const lesson1 = await prisma.lesson.create({
    data: {
      courseId: course.id,
      title: "Introduction to Programming",
      content: `
Programming is the process of giving instructions to a computer.

In this lesson, we learn:
• What programming is
• What programming languages are
• How programs are executed
• Basic problem solving concepts

Programming helps us solve problems by breaking them into smaller,
logical steps.
      `.trim(),
      position: 1,
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      courseId: course.id,
      title: "Variables and Data Types",
      content: `
Variables are used to store data in a program.

Common data types include:
• Integer
• Float
• Character
• String
• Boolean

Example:

int age = 20;

Here, age is a variable that stores the integer value 20.
      `.trim(),
      position: 2,
    },
  });

  const lesson3 = await prisma.lesson.create({
    data: {
      courseId: course.id,
      title: "Conditional Statements",
      content: `
Conditional statements allow a program to make decisions.

The most common conditional statement is if-else.

Example:

if (age >= 18) {
    printf("Adult");
} else {
    printf("Minor");
}

The condition is evaluated and the appropriate block of code is executed.
      `.trim(),
      position: 3,
    },
  });

  console.log("📖 3 lessons created");

  // =========================
  // ENROLL LEARNER
  // =========================

  const enrollment = await prisma.enrollment.create({
    data: {
      learnerId: learner.id,
      courseId: course.id,
    },
  });

  console.log("🎓 Learner enrolled");

  // =========================
  // PROGRESS
  // =========================

  await prisma.lessonProgress.create({
    data: {
      learnerId: learner.id,
      lessonId: lesson1.id,
      completed: true,
      completedAt: new Date(),
    },
  });

  await prisma.lessonProgress.create({
    data: {
      learnerId: learner.id,
      lessonId: lesson2.id,
      completed: false,
    },
  });

  console.log("📊 Progress created");

  // =========================
  // ACTIVITY LOGS
  // =========================

  await prisma.activityLog.create({
    data: {
      courseId: course.id,
      actorId: instructor.id,
      action: "CREATED",
      entityType: "COURSE",
      entityId: course.id,
      metadata: {
        title: course.title,
      },
    },
  });

  await prisma.activityLog.create({
    data: {
      courseId: course.id,
      actorId: instructor.id,
      action: "CREATED",
      entityType: "LESSON",
      entityId: lesson1.id,
      metadata: {
        title: lesson1.title,
        position: lesson1.position,
      },
    },
  });

  await prisma.activityLog.create({
    data: {
      courseId: course.id,
      actorId: learner.id,
      action: "COMPLETED",
      entityType: "LESSON",
      entityId: lesson1.id,
      metadata: {
        title: lesson1.title,
      },
    },
  });

  console.log("📝 Activity logs created");

  console.log("\n================================");
  console.log("🎉 SEED COMPLETED SUCCESSFULLY");
  console.log("================================");

  console.log("\n👨‍🏫 INSTRUCTOR");
  console.log("Email: instructor@test.com");
  console.log("Password: Test@123");

  console.log("\n👨‍🎓 LEARNER");
  console.log("Email: learner@test.com");
  console.log("Password: Test@123");

  console.log("\n📚 COURSE");
  console.log("Title:", course.title);
  console.log("ID:", course.id);

  console.log("\n📖 LESSONS");
  console.log("1.", lesson1.title);
  console.log("2.", lesson2.title);
  console.log("3.", lesson3.title);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });