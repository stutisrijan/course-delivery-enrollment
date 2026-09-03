# Development Plan

## Day 1 — Planning and Project Setup

### How did I break the work into sessions?

I first understood the requirements and divided the project into smaller parts: database, backend APIs, authentication, course management, enrollment, progress tracking, dashboard, activity history, alerts, frontend and deployment.

I decided to build the backend first and keep the frontend for later, because most frontend screens would depend on the APIs being ready.

### What order did I build in, and why?

I started with the basic project structure and database design. The database was important because users, courses, lessons, enrollments and progress all depend on it.

After that, I planned to move towards authentication and the main course-related APIs.

### What did I estimate versus what did it actually take?

I expected the initial setup and planning to take around 2–3 hours. The basic project structure, database planning and Prisma setup were completed within this initial setup period.

### What did I cut when I ran short?

I did not focus on UI styling or extra features at this stage. I focused on getting the project structure and database foundation ready first.

### Git Checkpoint

- `chore: initialize project structure`
- `feat: initialize frontend and backend`
- `docs: define database schema and setup prisma`

### Status

**Completed**

---

## Day 2 — August 29 — Database and Backend Foundation

### How did I break the work into sessions?

I focused this session on getting the backend connected to the database and making sure the basic server structure was working correctly.

### What order did I build in, and why?

I first completed the database migration and Prisma connection, and then worked on the backend foundation. This made sure the API layer had a working database before adding actual application features.

### What did I estimate versus what did it actually take?

I expected the database and backend foundation to be a relatively short setup task. It took some additional time to configure Prisma correctly and make sure the migration and connection were working properly.

### What did I cut when I ran short?

I kept the backend foundation simple and did not start implementing all the application features in this session. The priority was getting a stable base for the API work.

### Git Checkpoints

- `feat: add database schema and migration`
- `feat: add backend foundation and prisma connection`

### Status

**Completed**

---

## Day 3 — August 30 — Authentication, Courses and Lessons

### How did I break the work into sessions?

I moved from the backend foundation to the main application APIs. The focus was authentication, roles, courses and lessons.

### What order did I build in, and why?

Authentication came first because the remaining APIs need to know who the current user is and what role they have.

After authentication, I implemented courses and lessons because enrollment and progress depend on courses and their lessons.

### What did I estimate versus what did it actually take?

I expected authentication and the basic course/lesson APIs to be straightforward, but role-based permissions and validation required additional testing and corrections.

### What did I cut when I ran short?

I concentrated on the required API functionality instead of spending time on frontend screens or visual design. The goal was to get the core backend features working first.

### Git Checkpoint

- `feat: implement authentication course and lesson APIs`

### Status

**Completed**

---

## Day 4 — August 31 — Enrollment, Progress, Dashboard and Activity

### How did I break the work into sessions?

This was the biggest feature-building session. I divided the work into enrollment and progress first, followed by bulk enrollment and CSV export, then the instructor dashboard, activity history and comments.

### What order did I build in, and why?

Enrollment was needed before progress could be properly tracked for individual learners.

After that, I added bulk enrollment and progress export. Once the enrollment and progress data was available, I could use it for the instructor dashboard.

Finally, I added activity history and comments because these features depend on actions happening on courses.

### What did I estimate versus what did it actually take?

I expected this session to take more time because it covered several connected requirements. The actual work involved additional testing around enrollment results, progress calculations, dashboard data and activity records.

### What did I cut when I ran short?

I kept the dashboard and supporting UI focused on the required information rather than adding unnecessary visual features. The priority was completing the actual functionality and API behaviour.

### Git Checkpoints

- `feat: add bulk enrollment and progress export`
- `feat: complete instructor dashboard`
- `feat: implement course activity history and comments`

### Status

**Completed**

---

## Day 5 — September 1 — Alerts and Frontend

### How did I break the work into sessions?

I started by completing the remaining backend requirement for inactivity alerts. After that, I moved to the first full frontend version and connected the main application pages with the backend.

### What order did I build in, and why?

The inactivity alert API was completed first so that the frontend could later display real alert data.

Then I worked on the frontend, including the main navigation, authentication flow, course pages, learner/instructor views and reusable components.

### What did I estimate versus what did it actually take?

I expected the frontend to take longer than the individual backend features because several pages had to be connected together. Testing also revealed integration issues that needed to be fixed while building the frontend.

### What did I cut when I ran short?

I focused on making the required screens and flows functional rather than spending too much time on advanced animations or extra UI polish.

### Git Checkpoints

- `feat: added alert`
- `feat: adding publish api`
- `feat: Frontend V1`
- `Prepare project for Render and Vercel deployment`

### Status

**Completed**

---

## Day 6 — September 2 — Fixes, Certificate and Deployment

### How did I break the work into sessions?

The final session was mainly for testing the complete application, fixing issues found during integration and finishing the certificate and deployment-related work.

### What order did I build in, and why?

I first checked the frontend and backend working together. Then I fixed specific issues with comments and password validation.

After that, I added the completion certificate download option and finally fixed the CORS issue affecting the deployed Vercel frontend.

### What did I estimate versus what did it actually take?

I expected the final stage to mainly involve small fixes, but deployment exposed additional configuration issues, especially the CORS problem. These required some extra debugging and testing.

### What did I cut when I ran short?

At this point I avoided adding new major features. I focused on fixing existing functionality, completing the certificate requirement and making the deployed frontend communicate correctly with the backend.

### Git Checkpoints

- `fixed comment visibility and password validation`
- `feat:add completion certificate download option`
- `fix: resolve CORS issue for Vercel frontend`

### Status

**Completed**

---

# Overall Development Approach

I worked on the project in small feature-based sessions rather than trying to build everything at once.

The general order was:

**Planning → Database → Backend foundation → Authentication → Courses/Lessons → Enrollment/Progress → Dashboard/Activity/Alerts → Frontend → Deployment and fixes**

This order made sense because each stage depended on the previous one. For example, progress required enrollment, enrollment required users and courses, and the frontend required the backend APIs.

I also used a simple cycle throughout the project:

**Build → Test → Fix → Commit**

I made Git commits at major checkpoints so that the progress of the project could be tracked.

# Overall Estimate vs Actual Work

The initial setup was expected to take around 2–3 hours. The complete project took several focused development sessions from August 29 to September 4.

Some features took longer than expected because they required additional validation and testing, especially authentication, progress rules, frontend/backend integration and deployment.

The final day also took extra debugging because the deployed frontend had a CORS issue.

# What I Cut When Time Was Short

When time was limited, I prioritized the actual project requirements over extra UI polish.

I focused on completing:

- Authentication and role-based access
- Course and lesson management
- Enrollment and progress
- Course search and filtering
- Bulk enrollment and CSV export
- Dashboard
- Activity history and comments
- Inactivity alerts
- Completion certificate
- Deployment and important fixes

I kept the UI relatively simple where possible and avoided spending time on unnecessary features that were not part of the requirements.