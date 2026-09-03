# Decisions

## Decision 1 — Separate frontend and backend

- **Chose:** A React/Vite client that communicates with an Express API over HTTP.
- **Rejected:** A single application where UI code also directly handled data access and business rules.
- **Why:** The project requires role permissions, course state transitions, enrollment rules, and progress rules to be enforced on the server. A separate API makes that boundary explicit and keeps the frontend focused on the user experience.

## Decision 2 — Use JWT authentication with server-side role checks

- **Chose:** Email/password login that returns a JWT, with `authenticate` and `authorize` middleware protecting API routes for `INSTRUCTOR` and `LEARNER` roles.
- **Rejected:** Relying only on hiding instructor buttons in the React interface, or trusting a role value sent by the browser for each request.
- **Why:** UI visibility is not security. The API must reject a learner attempting to create courses, manage lessons, enroll other users, or access instructor-only information even if they manually call an endpoint.

## Decision 3 — Model progress per lesson and derive course progress

- **Chose:** Store a `LessonProgress` record for each learner/lesson pair and calculate the course state as Not Started, In Progress, or Completed from completed lessons.
- **Rejected:** Store a separate editable course-progress status directly on the enrollment record.
- **Why:** Lesson completion is the source of truth. Deriving the course state prevents a learner from being marked Completed before completing all lessons and avoids duplicated progress values becoming inconsistent.

## Decision 4 — Keep course history append-only

- **Chose:** Record course creation, updates, publishing, archiving, lesson changes, enrollments, and comments in `ActivityLog`, without update or delete endpoints for those records.
- **Rejected:** A normal editable comments/history table or overwriting a course's latest change information in one field.
- **Why:** The requirement states that history cannot be rewritten. An append-only log preserves who performed an action, what was changed, and when it happened, while still allowing the current course record to be edited.

## Decision 5 — Use Supabase Session Pooler for deployed database access

- **Chose:** Use Supabase's Session Pooler database URL for the Render API deployment, with secrets supplied through environment variables.
- **Rejected:** Keeping the Supabase direct database endpoint for every environment.
- **Why:** The direct Supabase endpoint uses IPv6 by default, while Render may not be able to reach it. The Session Pooler is suitable for the long-running Express service and works over IPv4.
- **Later reversed:** The initial local and deployed configuration used Supabase's direct endpoint because it was the simplest URL shown in the dashboard. It was changed after connection failures showed that the host could not reliably reach the IPv6 direct endpoint.
