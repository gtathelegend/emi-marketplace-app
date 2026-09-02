# ADR 002: Strict Layered Backend Architecture

## Context
Full-stack Express applications often suffer from "fat route handlers" where HTTP request parsing, Zod validation, business logic, financial math calculations, and direct database queries are mashed together in single files. This makes code untestable, difficult to maintain, and prone to duplication.

## Decision
We enforce a strict **Layered Architecture**:
`Routes -> Middleware -> Controllers -> Services -> Repositories -> Prisma ORM -> PostgreSQL`.

- **Routes**: Define HTTP paths and attach middlewares & controllers.
- **Middleware**: Intercept requests for auth, role authorization, validation, rate limiting, and error formatting.
- **Controllers**: Handle HTTP input extraction (`req.params`, `req.body`) and send formatted HTTP responses. Zero business logic or database queries allowed.
- **Services**: Execute domain business logic, financial EMI calculations, and transactional orchestrations. Zero Express `req`/`res` references allowed.
- **Repositories**: Encapsulate all Prisma ORM operations and database queries.

## Alternatives Considered
1. **Flat / Monolithic Route Handlers**:
   - *Pros*: Quick initial setup for tiny scripts.
   - *Cons*: Impossible to unit-test financial business logic without mocking Express HTTP objects; high risk of business logic duplication.
2. **Clean / Hexagonal Architecture (Ports & Adapters)**:
   - *Pros*: High decoupling from frameworks.
   - *Cons*: Over-engineered for a focused production assignment, introducing unnecessary interface abstractions and boilerplate.

## Reasoning
- **Testability**: Services can be unit-tested directly in Vitest by calling pure TypeScript methods with mock repository dependencies.
- **Separation of Concerns**: Prevents database details (Prisma) from leaking into HTTP handlers, and keeps HTTP concepts (status codes, headers) out of core financial calculations.
- **Maintainability**: Clear developer mental model where every line of code has a single, well-defined home.

## Trade-offs
- Requires writing thin controller and repository wrapper files, slightly increasing overall file count.
