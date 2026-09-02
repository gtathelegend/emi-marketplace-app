# ADR 006: Administrative Mutation Audit Logging

## Context
In financial marketplaces, administrative actions (modifying EMI plan interest rates, changing product prices, approving loan applications) must be strictly auditable for compliance, accountability, and security troubleshooting. Without audit logging, unauthorized state modifications or accidental price changes cannot be attributed to specific admin users or analyzed historically.

## Decision
1. **Automated Audit Logging**: Every administrative mutation (`POST / PUT / PATCH / DELETE`) automatically generates an immutable record in the `AuditLog` table.
2. **Audit Schema**: Capture `adminUserId`, `action` string (e.g. `UPDATE_EMI_PLAN`), `entity` string (e.g. `EMIPlan`), `entityId`, `beforeState` (JSONB snapshot), `afterState` (JSONB snapshot), `ipAddress`, `userAgent`, and `createdAt`.
3. **Audit Service Interceptor**: Triggered inside Service methods or custom Prisma middleware during mutation transactions.

## Alternatives Considered
1. **Application Log Files Only (Winston/Pino stdout)**:
   - *Pros*: Simple to write logs.
   - *Cons*: Difficult to search, aggregate, or query through an administrative dashboard UI; logs can rotate out and be lost.
2. **No Audit Logging**:
   - *Pros*: Zero performance overhead.
   - *Cons*: Non-defensible for a production financial application; leaves system vulnerable to undetected admin tampering.

## Reasoning
- **Accountability**: Every catalog, rate, and application change is tied to a verified admin account.
- **State Recovery & Analysis**: Storing full `beforeState` and `afterState` JSON snapshots allows inspecting exact previous rates and values.
- **UI Searchability**: Admin console exposes a dedicated Audit Log viewer tab with filtering by entity and date.

## Trade-offs
- Slight additional write latency (~5ms) during administrative mutations to save audit records in PostgreSQL.
