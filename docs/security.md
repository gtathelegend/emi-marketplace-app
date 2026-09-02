# Security & Threat Model — FinEmi Marketplace

## 1. Authentication & Authorization Security Model

### 1.1 Server-Side Boundary
- **Backend Authority**: Security boundaries are strictly enforced on the server. Frontend route guards (`ProtectedAdminRoute`) provide user experience navigation control, but every single admin REST endpoint under `/api/v1/admin/*` enforces server-side authentication (`requireAdmin` middleware).
- **JWT & HTTP-Only Cookie Strategy**: Admin authentication uses signed JWT tokens issued upon successful `POST /api/v1/admin/auth/login`. Tokens are stored in HTTP-only, secure, `SameSite=Lax` cookies `admin_token` (or `Authorization: Bearer <token>` header).
- **Deactivated Admin Protection**: Inactive admins (`isActive = false`) are rejected immediately at the middleware layer (HTTP 403 Forbidden).

### 1.2 Password Security & Hashing
- Passwords are never stored in plaintext or logged.
- Passwords are hashed using `bcryptjs` with salt round factor 10.
- Password hashes (`passwordHash`) are excluded from API response JSON objects.
- Login failures return generic messages (*"Invalid email or password"*) without exposing email existence.

---

## 2. Zero-Trust Customer Financing & Anti-Tampering

- **Financial Value Authority**: The frontend never calculates interest or posts calculated financial amounts to the backend.
- **Payload Safety**: `POST /api/v1/applications` accepts **ONLY** `variantId`, `emiPlanId`, and `customer` contact information. The backend resolves database prices and computes the authoritative immutable snapshot.

---

## 3. Historical Application Snapshot Protection

- Existing `EMIApplication` records store immutable commercial snapshots (`principalAmount`, `interestRateSnapshot`, `monthlyAmountSnapshot`, `cashbackSnapshot`, `totalPayableSnapshot`).
- Admin edits to products, variants, or EMI plans do **NOT** retroactively alter historical application contract snapshots.

---

## 4. Audit Logging & Accountability

- All meaningful administrative mutations (`CREATE_PRODUCT`, `UPDATE_PRODUCT`, `CREATE_VARIANT`, `CREATE_EMI_PROVIDER`, `CREATE_EMI_PLAN`, `UPDATE_APPLICATION_STATUS`) execute within Prisma transactions (`$transaction`) alongside `AuditLog` records.
- Captures `adminUserId`, `action`, `entityType`, `entityId`, before/after state diffs, IP address, and User-Agent.
- Sensitive credentials (passwords, tokens) are omitted from audit logs.
