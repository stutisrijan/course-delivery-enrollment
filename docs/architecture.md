# Architecture

## Initial Architecture

The application uses a client-server architecture.

The frontend is built with React and Vite. It is responsible for the
user interface and communicates with the backend through HTTP APIs.

The backend is built with Node.js and Express. It is responsible for
API handling, authentication, authorization, business rules and
database access.

PostgreSQL will be used as the persistent relational database, with
Prisma used as the database ORM.

The current request flow is:

Browser
→ React frontend
→ Express API
→ Prisma
→ PostgreSQL

Security-sensitive rules such as authentication, role authorization
and business state transitions will be enforced by the backend rather
than relying only on frontend visibility.