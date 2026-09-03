# Architecture

## Moving pieces and communication

The system has four main parts:

- **React + Vite frontend:** The browser application provides separate instructor and learner workspaces. It renders the course catalogue, dashboards, enrollment tools, lesson management, learner progress, activity history, alerts, and completion certificate download.
- **Express API:** The backend exposes REST endpoints under `/api`. It authenticates requests, applies role checks, enforces course and progress rules, and returns JSON or CSV data.
- **Prisma:** Prisma is the data-access layer used by the API. It maps the application models to PostgreSQL queries and keeps database access in one place.
- **PostgreSQL (Supabase):** Stores users, courses, lessons, enrollments, lesson progress, activity logs, and inactivity alerts.

The frontend sends HTTP requests with an `Authorization: Bearer <JWT>` header after login. Express verifies the JWT, checks the role and ownership where required, then reads or writes through Prisma. The API sends the result back to the frontend. CORS only permits the configured Vercel frontend and the project’s Vercel deployment URLs.

## Where each piece runs

- The React/Vite frontend is deployed to **Vercel**. During development it runs locally through the Vite dev server.
- The Node.js/Express API is deployed to **Render**. During development it runs locally on port 5000.
- PostgreSQL is hosted by **Supabase**. The deployed API uses environment variables for the database URL and JWT secret; these values are not included in the frontend bundle or committed to Git.
- Prisma runs inside the Express process on Render or locally, rather than as a separate hosted service.

## Representative request path: learner completes a lesson

1. A learner signs in with email and password. The API verifies the password hash and returns a JWT containing the user ID and `LEARNER` role.
2. The learner opens an enrolled course. The React app requests the course and the learner’s own course progress.
3. When the learner clicks **Mark complete**, the frontend sends `PATCH /api/progress/lessons/:lessonId` with the JWT.
4. The Express authentication middleware validates the JWT. The route then requires the `LEARNER` role.
5. The progress controller verifies that the lesson exists and that this learner is enrolled in that lesson’s course. It creates or updates only that learner’s `LessonProgress` record. Completing the same lesson again is rejected.
6. The frontend refreshes its progress display. The API derives the course state from that learner’s completed lessons: no completed lessons is Not Started, some is In Progress, and all is Completed.
7. When all lessons are completed, the frontend unlocks a personalized downloadable completion certificate. The certificate is available only after the server-reported progress state is Completed.

## Server-side rule enforcement

The frontend changes what users can see, but the backend is the source of authority:

- Instructor-only routes require the `INSTRUCTOR` role and verify course ownership before course, lesson, enrollment, export, activity-log, or alert operations are performed.
- Learner-only routes require the `LEARNER` role and only permit self-enrollment, personal enrollment retrieval, and the learner’s own lesson progress.
- Courses start in Draft. Publishing rejects courses with no lessons, archiving requires Published status, and restoring requires Archived status.
- Enrollment is only permitted for published courses and the learner/course database constraint prevents duplicates.
- The course catalogue performs search, filters, sorting, pagination, and result totals on the server before returning a page of results.
- Bulk enrollment returns one outcome per supplied email: unknown user, already enrolled, or newly enrolled.
- Activity entries are append-only. There are no API routes to edit or delete activity history.
- Inactivity alerts are calculated from the learner’s latest completed lesson. A dismissed alert is shown again only after later learner progress and a further period of more than fourteen inactive days.

## What was intentionally not built

The following features were deferred because the required course, enrollment, progress, reporting, history, and alert flows were prioritized within the available implementation time:

- Discussion threads attached to individual lessons. Course-level immutable comments are implemented instead.
- Prerequisite courses that prevent enrollment.
- Video lesson delivery and watch-progress tracking.
- Course ratings and reviews.
- Learning paths that combine multiple courses.
- Downloadable lesson resources.
- Scheduled email digests for inactive learners. Inactivity alerts are available in the instructor workspace, but are not emailed automatically.

These additions would require new database models, authorization rules, UI workflows, and in the case of email delivery, an external email provider and scheduled jobs. They were kept out of the current scope to avoid weakening the correctness of the required features.
