# AI Prompts

## Prompt 1 — Project Planning and Technology Stack

### Prompt

I need to build a Course Delivery & Enrollment web application for a company assignment with approximately 12 hours of development time. The application requires authentication with instructor and learner roles, courses, lessons, publishing/archive states, learner enrollment and progress tracking, server-side search/filtering/pagination, bulk enrollment with CSV export, an instructor dashboard, immutable activity logs, and inactivity alerts.

Create a simple and presentable technology stack and development plan. Explain why each technology should be selected. I also need to submit multiple documents, so provide an exact documentation checklist and suggest whether documentation should be done simultaneously with development or after the project.

### What I got

The project was planned as an incremental full-stack application using React/Vite for the frontend, Express/Node.js for the backend, PostgreSQL for the database, and Prisma as the ORM.

The development was divided into small steps so that implementation, testing, documentation, and Git commits could be completed continuously.

### What I corrected

The original approach was changed to work in 2–3 hour development sessions.

Each meaningful step will be tested, documented, and committed before moving to the next step. AI prompts and important development decisions will also be recorded in the project documentation.

---

## Prompt 2 — Database Design and Prisma Setup

### Prompt

Design and implement the database structure for the Course Delivery & Enrollment application.

The database must support instructors and learners, course creation, Draft/Published/Archived course states, lessons and lesson ordering, many-to-many learner/course enrollment, learner lesson progress, immutable activity history, 14-day inactivity alerts, and server-side course search and filtering.

Use PostgreSQL with Prisma. First document the database design, then implement the Prisma schema. Include appropriate relationships, unique constraints, foreign keys, and indexes. Do not expose database credentials.

### What I got

The database design was documented in `docs/schema.md`.

The main entities were:

- User
- Course
- Lesson
- Enrollment
- LessonProgress
- ActivityLog
- InactivityAlert

The Prisma schema was implemented in `server/prisma/schema.prisma`.

The schema includes UUID primary keys, role and course-status enums, relationships, unique constraints, and indexes.

The schema was formatted and successfully validated using Prisma.

An initial migration was created and successfully applied to the Supabase PostgreSQL database.

### What I corrected

The database design was kept separate from application-level business rules.

The real database credentials were kept in `server/.env`, which is excluded from Git, while `server/.env.example` contains only the required environment-variable structure.

Course archiving was designed to preserve lessons and enrollment history, and activity logs were designed as append-only records.