# ADR 001: Selection of PostgreSQL as the Primary Relational Database

## Context
The **EMI App** application handles financial transactions, inventory cataloging, EMI financing agreements, and audit logging. Financial loan application snapshots require ACID compliance, strict foreign key constraints, table normalization, and reliable indexing for fast catalog searches and tracking queries.

## Decision
We choose **PostgreSQL** (version 15+) as our primary relational database management system, accessed via **Prisma ORM**.

## Alternatives Considered
1. **MongoDB (NoSQL Document Store)**:
   - *Pros*: Flexible schema for product specifications.
   - *Cons*: Lack of declarative foreign key enforcement increases risk of orphaned EMI plans or corrupted financial application snapshot relationships. Multi-document transactions require complex session handling.
2. **SQLite**:
   - *Pros*: Simple zero-config file database.
   - *Cons*: Concurrent writing limitations in production node environments; lacks production JSONB querying performance for audit logs.

## Reasoning
1. **Relational Integrity**: Product catalog hierarchies (Brand -> Category -> Product -> Variant -> Images/Specs/EMIPlans) require strict 3NF normalization and foreign key cascading rules (`ON DELETE RESTRICT` for applications).
2. **ACID Transactions**: Financial loan contract creation must be atomic (`BEGIN ... COMMIT`), writing the application record alongside audit logs without risk of partial writes.
3. **JSONB Auditing**: PostgreSQL's native `JSONB` support allows recording rich before/after administrative change states while retaining structural indexing capabilities.
4. **Ecosystem & Tooling**: Seamless integration with Prisma ORM and hosted cloud platforms (Neon, Supabase, Render PostgreSQL).

## Trade-offs
- Requires database migration management (`prisma migrate`) when schema evolves.
- Higher deployment overhead compared to embedded databases like SQLite, mitigated by using managed cloud PostgreSQL providers.
