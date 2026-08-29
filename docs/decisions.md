# Technical Decisions

## Decision 1 — Client/Server Separation

### Chosen
Separate React frontend and Express backend.

### Reason
The assignment contains server-side authorization and business rules.
Keeping the backend separate makes it clear that security-sensitive
operations are enforced by the server.

It also allows the frontend UI to be changed later without requiring
the backend architecture to change.

### Alternatives Considered
A single application structure was considered, but the separate
client/server structure provides a clearer API boundary and is easier
to explain during evaluation.