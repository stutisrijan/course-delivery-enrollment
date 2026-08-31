# AI Prompts

## Prompt 1 — Project Planning and Technology Stack

### Prompt
Plan a Course Delivery & Enrollment application with authentication, courses, lessons, enrollment, progress tracking, search, bulk enrollment, dashboard, activity logs, and inactivity alerts. Suggest a suitable technology stack and development plan.

### What I got
React/Vite, Node.js/Express, PostgreSQL/Supabase, and Prisma were selected. Development was divided into small tested checkpoints with continuous documentation and Git commits.

---

## Prompt 2 — Database Design and Prisma Setup

### Prompt
Design a PostgreSQL database using Prisma for users, courses, lessons, enrollments, lesson progress, activity logs, and inactivity alerts. Include relationships, constraints, indexes, and course/progress states.

### What I got
The Prisma schema and database documentation were created. The schema was formatted, validated, migrated, and successfully connected to Supabase PostgreSQL.

---

## Prompt 3 — Backend Foundation and Authentication

### Prompt
Set up an Express backend with Prisma 7, CORS, JSON middleware, health-check APIs, registration/login using bcryptjs and JWT, authentication middleware, and role-based authorization.

### What I got
The backend structure, Prisma connection, health APIs, registration, login, JWT authentication, and instructor/learner authorization were implemented and tested.

### What I corrected
The backend was converted to ES Modules to support the Prisma 7 setup correctly.

---

## Prompt 4 — Courses, Lessons, Enrollment and Progress

### Prompt
Implement course CRUD, publishing, archiving/restoring, lesson management and reordering, instructor enrollment, learner self-enrollment, and learner progress tracking.

### What I got
Courses, lessons, enrollment, lesson completion, and progress tracking were implemented and tested.

Progress correctly moves:

`NOT_STARTED → IN_PROGRESS → COMPLETED`

Lesson reordering validates that every lesson ID is included exactly once.

---

## Prompt 5 — Course Finding, Bulk Enrollment and CSV Export

### Prompt
Implement server-side course search, filtering, sorting and pagination. Implement bulk learner enrollment by email and CSV export of enrolled learners' progress.

### What I got
Server-side course search/filtering/sorting/pagination was implemented.

Bulk enrollment correctly reports:

- `UNKNOWN`
- `ALREADY_ENROLLED`
- `NEWLY_ENROLLED`

CSV progress export was implemented and tested with learner name, email, course, lessons, percentage, and state.
