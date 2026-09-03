# AI Prompts

The prompts I used while developing the Course Delivery & Enrollment project. I used AI mainly for planning, understanding implementation steps, and troubleshooting. I made the final implementation decisions and tested the changes myself.

## Prompt 1 — Project Planning and Structure

### What I was trying to achieve

I wanted to plan the project properly before starting the implementation and divide the work into manageable stages.

### Prompt

> I need to build a Course Delivery & Enrollment system using React, Node.js/Express, PostgreSQL and Prisma. It needs authentication, instructor and learner roles, courses, lessons, enrollment, progress tracking, search, bulk enrollment, dashboard, activity history, comments and inactivity alerts.
>
> Give me a practical step-by-step development plan, including the project structure, database setup, backend APIs and frontend development order. Keep the work divided into small stages so I can implement and test each stage before moving to the next one.

### What I got

A development plan covering the project setup, database, backend features and frontend.

### What I did

I used the plan as a starting point and decided the actual implementation order based on my project requirements.

---

## Prompt 2 — Database Design and Prisma

### What I was trying to achieve

I wanted to design the database before building the APIs.

### Prompt

> Help me design the database for this project using PostgreSQL and Prisma. I need users, roles, courses, lessons, enrollments, progress, activity history, comments and inactivity alerts. Explain the tables, relationships and important constraints, then tell me the steps to set up Prisma and run the first migration.

### What I got

A database structure with the required entities, relationships and course/progress states, along with Prisma setup and migration steps.

### What I did

I created the schema, formatted and validated it, connected it to Supabase PostgreSQL and applied the migration. I also adjusted the schema where it did not match my requirements.

---

## Prompt 3 — Backend Foundation and Authentication

### What I was trying to achieve

I wanted to set up the Express backend and implement authentication with role-based access.

### Prompt

> Tell me the steps to set up my Express backend with Prisma, CORS and JSON middleware. Then help me add register, login, JWT authentication and middleware for INSTRUCTOR and LEARNER roles. Show me which files to create and where each part should go.

### What I got

The basic backend structure, authentication APIs, JWT handling and authorization middleware.

### What I corrected

I had to adjust the setup for Prisma 7 and use ES Modules correctly. I also tested the authentication and role restrictions through the APIs.

---

## Prompt 4 — Course, Lesson, Enrollment and Progress APIs

### What I was trying to achieve

I wanted to build the main course delivery functionality after authentication was working.

### Prompt

> Help me implement the course and lesson APIs step by step. I need create, edit, publish, archive and restore courses, lesson CRUD and reordering, instructor enrollment, learner self-enrollment and lesson completion. Also explain how to enforce the course and progress state rules on the server.

### What I got

The course, lesson, enrollment and progress controllers and routes were added according to the required API structure.

### What I corrected

I tested the role restrictions and state transitions myself. I also made sure an empty course could not be published and that learner progress could only be changed by the correct learner.

---

## Prompt 5 — Search, Bulk Enrollment, Dashboard, Activity and Alerts

### What I was trying to achieve

I wanted to finish the remaining backend requirements and make sure the APIs covered the full specification.

### Prompt

> Help me add the remaining backend features: server-side course search with filters, sorting and pagination, bulk enrollment by email, CSV progress export, instructor dashboard, course activity history, comments and 14-day inactivity alerts. Give me the implementation steps and mention the important rules I need to test.

### What I got

The remaining backend APIs were implemented for course search, bulk enrollment, CSV export, dashboard data, activity history, comments and inactivity alerts.

### What I corrected

I tested the different bulk enrollment results, CSV output, dashboard data and alert behaviour. I also checked that activity history could not be edited or deleted and that dismissed inactivity alerts could reappear when the learner became inactive again.

---

## Prompt 6 — Frontend

### What I was trying to achieve

After completing the backend, I wanted to connect the APIs to a usable React frontend.

### Prompt

> Help me build the React frontend for the APIs I have created. I need login, role-based navigation, course listing and search, course details and lessons, instructor course management, learner enrollment and progress, dashboard, activity, comments and alerts. Give me the files and implementation steps in a simple order.

### What I got

A React/Vite frontend structure with pages, reusable components, authentication context, API service functions and role-based routing.

### What I corrected

The first frontend setup had import and routing issues, including blank-page errors. I checked the browser console, fixed the incorrect imports and connected the frontend to the actual backend endpoints.

---

## Overall Use of AI

AI was used as a development assistant rather than as a replacement for the implementation. I used it to plan the work, understand unfamiliar parts, get implementation steps and troubleshoot errors.

I made the changes in my own project, tested the APIs and frontend, and corrected the output whenever it did not match the project requirements.
