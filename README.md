# Courseflow — Course Delivery & Enrollment

Courseflow is a full-stack learning-management application for creating, delivering, enrolling in, and tracking progress through courses. It supports two server-enforced roles: **instructors** manage course content and learners, while **learners** enroll in published courses and complete lessons at their own pace.

## Features

### Accounts and access control

- Email/password registration and login.
- Learner and instructor account roles.
- JWT-authenticated API requests.
- Server-side role and course-ownership checks; permissions are not enforced only by hiding UI controls.
- Password validation requiring at least eight characters, one letter, and one number.

### Course and lesson management

- Instructors can create and edit courses with a title, description, and category.
- Course lifecycle: **Draft → Published → Archived**; archived courses can be restored.
- Empty courses cannot be published.
- Instructors can add, edit, delete, and reorder lessons.
- Lessons are displayed in their course position order.

### Enrollment and learner progress

- Learners can browse and self-enroll in published courses.
- Instructors can enroll learners individually or in bulk with pasted/uploaded email addresses.
- Bulk enrollment reports `UNKNOWN`, `ALREADY_ENROLLED`, or `NEWLY_ENROLLED` for every email address.
- Learners see their enrolled courses and personal progress only.
- Progress is calculated from lesson completion: **Not Started → In Progress → Completed**.
- A downloadable personalized completion certificate is unlocked after all lessons are complete.
- Instructors can export enrolled learner progress as CSV.

### Search, reporting, history, and alerts

- Server-side course search, category/status/instructor filters, sorting, pagination, and total matches.
- Instructor dashboard with learner/course totals, progress-state breakdown, course enrollment summary, and eight-week completion chart.
- Append-only course activity history for course, lesson, enrollment, and comment activity.
- Course comments for instructors and enrolled learners.
- Inactivity alerts for learners who are In Progress but inactive for more than fourteen days, including dismiss-and-reappear behavior after new learner activity.
- Light and dark theme toggle with saved browser preference.

## Tech stack

| Area | Technology |
| --- | --- |
| Frontend | React, Vite, Axios, CSS |
| Backend | Node.js, Express |
| Authentication | JWT and bcryptjs |
| Database | PostgreSQL / Supabase |
| ORM | Prisma 7 with `@prisma/adapter-pg` |
| Frontend deployment | Vercel |
| Backend deployment | Render |

## Architecture

```text
Browser (React/Vite)
        |
        | HTTPS + JWT bearer token
        v
Express REST API (Render)
        |
        | Prisma
        v
PostgreSQL (Supabase)
```

The API owns authorization, state-transition checks, enrollment validation, server-side catalogue processing, and activity logging. See [docs/architecture.md](docs/architecture.md) for the detailed design and [docs/schema.md](docs/schema.md) for the database model.

## Project structure

```text
.
├── client/                 # React/Vite browser application
│   ├── src/
│   │   ├── App.jsx         # Main UI and client workflows
│   │   └── services/api.js # Axios API client and JWT header handling
│   └── .env.example
├── server/                 # Express REST API
│   ├── prisma/             # Prisma schema and migrations
│   ├── src/controllers/    # Business logic
│   ├── src/routes/         # API routes
│   └── src/middleware/     # Authentication and authorization
└── docs/                   # Architecture, schema, decisions, and plan
```

## Run locally

### Prerequisites

- Node.js 20+ recommended
- npm
- A PostgreSQL database (Supabase is used by this project)

### 1. Configure environment variables

Create these local files from the included examples:

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

Set the server variables in `server/.env`:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="use_a_long_random_secret"
CLIENT_URL="http://localhost:5173"
```

Set the client variable in `client/.env`:

```env
VITE_API_URL="http://localhost:5000/api"
```

Never commit `.env` files or expose database passwords/JWT secrets. If using Supabase from a network without reliable IPv6 support, use the Supabase **Session Pooler** connection URI rather than the direct database URI.

### 2. Install dependencies

```powershell
cd server
npm install

cd ..\client
npm install
```

### 3. Start the API

Open one terminal:

```powershell
cd server
npm run dev
```

The API runs at `http://localhost:5000` and health status is available at `GET /api/health`.

### 4. Start the frontend

Open a second terminal:

```powershell
cd client
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## Core API routes

| Area | Example endpoints |
| --- | --- |
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Courses | `GET/POST /api/courses`, `PUT /api/courses/:id`, `PATCH /api/courses/:id/publish` |
| Lessons | `GET/POST /api/courses/:courseId/lessons`, `PUT /api/lessons/:lessonId` |
| Enrollment | `POST /api/enrollments/courses/:courseId/self-enroll`, `GET /api/enrollments/my` |
| Progress | `PATCH /api/progress/lessons/:lessonId/complete`, `GET /api/progress/courses/:courseId` |
| Reporting | `GET /api/dashboard`, `GET /api/inactivity-alerts` |
| History | `GET /api/courses/:courseId/activity`, `POST /api/courses/:courseId/comments` |

## Quality checks

Build the frontend production bundle:

```powershell
cd client
npm.cmd run build
```

Lint the frontend:

```powershell
npm.cmd run lint
```

## Deployment

- Deploy `server/` as a Node web service on **Render**.
- Deploy `client/` as a Vite project on **Vercel**.
- In Vercel, set `VITE_API_URL` to `https://YOUR-RENDER-SERVICE.onrender.com/api`.
- In Render, set `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`, and `CLIENT_URL` to the Vercel frontend URL.

## Documentation

- [Architecture](docs/architecture.md)
- [Database schema](docs/schema.md)
- [Technical decisions](docs/decisions.md)
- [Development plan](docs/plan.md)

## Future scope

The current project does not include lesson discussion threads, prerequisite courses, video watch tracking, ratings/reviews, learning paths, downloadable lesson resources, or scheduled inactivity-email digests. These were deferred to keep the required course, enrollment, progress, reporting, and authorization workflows complete within the project scope.
