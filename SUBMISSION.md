# Submission

## Links

- **GitHub repository:** <https://github.com/stutisrijan/course-delivery-enrollment>
- **Live application:** <https://course-delivery-enrollment.vercel.app/>

## Notes for the reviewer

The frontend is hosted on Vercel and the Express API is hosted on Render. Render's free service can sleep after inactivity, so the first API request may take up to **50 seconds** to respond. Please wait briefly and retry if the first sign-in or registration request appears to fail.


## Demo credentials

| Role | Email | Password |
| --- | --- | --- |
| Instructor | instructor@test.com | Test@123 |
| Learner | Learner@gmail.com | Learner@123 |
| Learner  | 22803011@mail.jiit.ac.in | 22803011 |

## Stack

| Layer | What I used | Why |
| --- | --- | --- |
| Frontend | React, Vite, Axios, CSS | Fast single-page UI with reusable components and straightforward API integration. |
| Backend | Node.js, Express, JWT, bcryptjs | Keeps authentication, authorization, state transitions, and business rules on the server. |
| Database | PostgreSQL on Supabase with Prisma ORM | Relational data fits users, courses, lessons, enrollments, progress, and immutable activity history. Prisma provides typed, structured database access. |
| Hosting | Vercel for frontend; Render for API; Supabase for PostgreSQL | Separates browser delivery, API execution, and persistent database hosting. |

## Goal checklist

| # | Goal | Status | Notes |
| --- | --- | --- | --- |
| 1 | Accounts and server-enforced instructor/learner roles | Done | JWT authentication and server-side role/ownership middleware protect instructor-only and learner-only API routes. |
| 2 | Course create, edit, publish, archive, and restore | Done | Courses start as Draft; archived courses preserve lessons and enrollment history. |
| 3 | Lesson management and ordering | Done | Instructors can add, edit, delete, and reorder lessons; courses return lessons ordered by position. |
| 4 | Course and learner-progress states | Done | Empty courses cannot publish. Learner progress is derived from completed lessons as Not Started, In Progress, or Completed. |
| 5 | Enrollment and learner course list | Done | Learners self-enroll in published courses; instructors can enroll learners through the enrollment tools; learners see only their own enrollments and progress. |
| 6 | Server-side course finding | Done | The API performs title/description search, filters, sorting, pagination, and totals before data reaches the browser. |
| 7 | Bulk enrollment and CSV progress export | Done | Pasted/uploaded email lists return unknown/already-enrolled/newly-enrolled outcomes; instructors can export course progress as CSV. |
| 8 | Instructor dashboard | Done | Includes headline metrics, course/progress breakdowns, and an eight-week completion chart. |
| 9 | Immutable activity history and comments | Done | Course, lesson, enrollment, status-change, and comment events are append-only; no edit/delete activity endpoints exist. |
| 10 | Inactivity alerts | Done | The API identifies In Progress learners inactive for over fourteen days; instructors can dismiss alerts, which can reappear after new progress followed by another inactive period. |

## How much time did you actually spend?

Approximately **15 hours**.

## What would you do next, with another 12 hours?

- Improve the frontend further, especially component organization, visual polish, accessibility, and responsive states.
- Add quizzes with automatic scoring.
- Add discussion threads per lesson.
- Add prerequisite courses that gate enrollment.
- Add video lessons with watch-progress tracking.
- Add course ratings and reviews.
- Add learning paths that bundle several courses.
- Add downloadable resources per lesson.
- Add scheduled email digests for inactive learners.
- Add a dedicated automated integration test suite with seeded test data for authorization, course transitions, progress transitions, bulk enrollment outcomes, and inactivity alerts.

## What are you least happy with in this codebase, and why?

I’m least happy with the frontend structure and polish. It works and covers the required flows, but the UI could be more refined with additional time—especially responsive behavior, loading/error states, and more reusable component styling..
