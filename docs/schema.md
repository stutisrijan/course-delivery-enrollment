# Database Schema

## Overview

The Course Delivery & Enrollment application uses a relational PostgreSQL database. Prisma is used as the ORM for database access.

The main entities are:

- User
- Course
- Lesson
- Enrollment
- Lesson Progress
- Activity Log
- Inactivity Alert

The schema is designed to support instructor course management, learner enrollment and progress tracking, course history, server-side course search, dashboards, and inactivity alerts.

## 1. User

The User entity stores both instructors and learners.

### Main fields

- **id** — unique identifier for the user.
- **name** — user's display name.
- **email** — unique email used for login.
- **passwordHash** — securely hashed password; the plain password is never stored.
- **role** — identifies whether the user is an Instructor or Learner.
- **createdAt** — account creation timestamp.
- **updatedAt** — timestamp of the latest account update.

### Relationships

- An instructor can create many courses.
- A learner can have many enrollments.
- A learner can have many lesson-progress records.
- A user can generate many activity-log records.
- A learner can have many inactivity alerts.

## 2. Course

The Course entity stores courses created and managed by instructors.

### Main fields

- **id** — unique course identifier.
- **title** — course title.
- **description** — course description.
- **category** — category of the course.
- **status** — course state: Draft, Published, or Archived.
- **instructorId** — identifies the instructor who owns the course.
- **createdAt** — course creation timestamp.
- **updatedAt** — timestamp of the latest update.

### Course state

The normal course lifecycle is:

**Draft → Published → Archived**

An archived course can be restored when required.

### Business rules

- Only instructors can create and manage courses.
- A new course starts as Draft.
- A course must contain at least one lesson before it can be published.
- Published courses can be archived.
- Archiving a course must not delete its lessons or enrollment history.
- Archived courses should not accept new learner enrollments.

## 3. Lesson

The Lesson entity stores individual lessons belonging to a course.

### Main fields

- **id** — unique lesson identifier.
- **courseId** — identifies the course to which the lesson belongs.
- **title** — lesson title.
- **content** — lesson content.
- **position** — determines the running order of the lesson within the course.
- **createdAt** — lesson creation timestamp.
- **updatedAt** — timestamp of the latest update.

### Relationships

- Each lesson belongs to one course.
- A course can contain many lessons.
- A lesson can have progress records for many learners.

### Business rules

- Instructors can add lessons to their own courses.
- Instructors can edit lessons.
- Instructors can reorder lessons.
- Instructors can remove lessons.
- Lesson order is maintained using the position field.

## 4. Enrollment

The Enrollment entity represents a learner's enrollment in a course.

### Main fields

- **id** — unique enrollment identifier.
- **learnerId** — identifies the learner.
- **courseId** — identifies the enrolled course.
- **enrolledAt** — enrollment timestamp.

### Relationship

Enrollment represents the many-to-many relationship between Learners and Courses.

A learner can enroll in many courses, and a course can have many learners.

### Constraints and rules

- A learner must not be enrolled in the same course more than once.
- The combination of learner and course must therefore be unique.
- Learners can self-enroll in eligible published courses.
- Instructors can enroll learners.
- Archived courses do not accept new enrollment.
- Existing enrollment history is retained when a course is archived.

## 5. Lesson Progress

Lesson Progress stores the progress of an individual learner on an individual lesson.

### Main fields

- **id** — unique progress-record identifier.
- **learnerId** — identifies the learner.
- **lessonId** — identifies the lesson.
- **completed** — indicates whether the lesson has been completed.
- **completedAt** — timestamp of completion when applicable.
- **updatedAt** — timestamp of the latest progress update.

### Constraints

A learner should have only one progress record for a particular lesson.

Therefore, the combination of **learnerId + lessonId** must be unique.

### Course progress

Course progress is determined from the learner's lesson progress.

The required course progress states are:

**Not Started → In Progress → Completed**

The backend must control valid progress transitions and reject illegal transitions.

Learners must only be able to update their own progress and must not be able to view another learner's progress.

## 6. Activity Log

The Activity Log stores the history of important actions performed in the system.

### Main fields

- **id** — unique activity identifier.
- **courseId** — related course.
- **actorId** — user who performed the action.
- **action** — action that occurred.
- **entityType** — type of entity affected.
- **entityId** — identifier of the affected entity.
- **comment** — optional comment associated with the activity.
- **metadata** — optional additional event information.
- **createdAt** — timestamp when the activity occurred.

### Examples of activities

- Course created
- Course edited
- Course published
- Course archived
- Course restored
- Lesson added
- Lesson edited
- Lesson reordered
- Lesson removed
- Learner enrolled
- Bulk enrollment performed
- Learner or instructor comment added

### Immutability

Activity history is append-only.

Normal application operations must not allow existing activity-log entries to be:

- edited
- deleted

This ensures that the course history cannot be rewritten.

## 7. Inactivity Alert

The Inactivity Alert entity supports instructor alerts for learners who stop making progress.

### Main fields

- **id** — unique alert identifier.
- **learnerId** — learner associated with the alert.
- **courseId** — course associated with the alert.
- **lastProgressAt** — progress timestamp used when determining inactivity.
- **dismissedAt** — timestamp when an instructor dismissed the alert, when applicable.
- **createdAt** — alert creation timestamp.

### Business rules

An inactivity alert applies when:

- the learner's course progress is In Progress, and
- the learner has made no further progress for more than 14 days.

An instructor can dismiss the alert.

If the learner later makes progress and then becomes inactive again for another 14-day period, a new alert can appear.

## Relationships

### One-to-many relationships

- One Instructor → many Courses.
- One Course → many Lessons.
- One Course → many Enrollments.
- One Learner → many Enrollments.
- One Lesson → many Lesson Progress records.
- One Learner → many Lesson Progress records.
- One User → many Activity Log records.
- One Course → many Activity Log records.
- One Learner → many Inactivity Alerts.
- One Course → many Inactivity Alerts.

### Many-to-many relationship

Learners and Courses have a many-to-many relationship implemented through the Enrollment entity.

**Learner ↔ Enrollment ↔ Course**

## Database Constraints

The database should enforce data-integrity constraints such as:

- User email must be unique.
- Enrollment learner/course combination must be unique.
- Lesson Progress learner/lesson combination must be unique.
- Required foreign-key relationships must be valid.
- Required fields must not be null.

## Application-Level Rules

The backend must enforce business and authorization rules such as:

- Only instructors can manage their own courses.
- Only instructors can manage lessons for their courses.
- A course cannot be published without at least one lesson.
- Only eligible published courses can receive normal learner enrollment.
- Archived courses cannot receive new enrollment.
- Valid course state transitions must be enforced.
- Valid learner progress transitions must be enforced.
- Learners can modify only their own progress.
- Learners cannot view another learner's progress.
- Activity logs cannot be edited or deleted.
- The 14-day inactivity rule must be enforced.
- Dismissed inactivity alerts must be able to reappear after later progress followed by another inactive period.

## Search, Filtering, Sorting and Indexing

The course catalogue requires server-side processing for:

- text search across course title and description
- category filtering
- status filtering
- instructor filtering
- sorting by title
- sorting by creation date
- sorting by enrollment count
- pagination
- total result count

The browser should not load the entire course catalogue and perform these operations locally.

Indexes will be considered for frequently queried fields such as:

- User email
- Course status
- Course category
- Course instructor
- Course creation date
- Enrollment learner
- Enrollment course
- Lesson course
- Lesson position
- Lesson Progress learner
- Lesson Progress lesson
- Activity Log course
- Activity Log createdAt
- Inactivity Alert learner
- Inactivity Alert course

## Deliberate Denormalisation

No major deliberate denormalisation is planned initially.

Course progress will be derived from lesson-progress data rather than storing a separate duplicated progress value that could become inconsistent.

Dashboard enrollment counts can initially be calculated using database aggregation queries instead of storing a duplicated count.

## What Would Break First at 100x the Data?

If the application grew to approximately 100 times its initial data volume, the most likely pressure points would be:

1. Course search, filtering and sorting.
2. Sorting courses by enrollment count.
3. Instructor dashboard aggregation queries.
4. Large activity-log histories.
5. Eight-week completion analytics.
6. Inactivity-alert calculations across many learners.

At larger scale, these areas could require additional indexes, optimized queries, pagination improvements, caching, or precomputed aggregates where justified.

## Schema Design Summary

The schema separates core user, course, lesson, enrollment, progress, audit-history and inactivity-alert data.

The design keeps important data relationships explicit, uses database constraints for basic integrity, and leaves authorization and business-state rules to the backend service.
