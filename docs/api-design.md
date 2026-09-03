# API Design Specification — EMI App

## 1. REST API Architecture

Base URL: `http://localhost:5000/api/v1`

Standard Response Envelope:
```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "req_12345",
    "timestamp": "2026-09-02T22:00:00.000Z"
  }
}
```

Standard Error Envelope:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid product creation payload",
    "details": {}
  },
  "meta": {
    "requestId": "req_12345",
    "timestamp": "2026-09-02T22:00:00.000Z"
  }
}
```

---

## 2. Admin Platform REST Endpoints (`/api/v1/admin`)

### Auth Endpoints
- `POST /api/v1/admin/auth/login`: Authenticates admin email & password, sets `admin_token` cookie.
- `POST /api/v1/admin/auth/logout`: Clears `admin_token` cookie.
- `GET /api/v1/admin/auth/me`: Returns current authenticated admin profile.

### Dashboard & Analytics
- `GET /api/v1/admin/dashboard/summary`: Returns live metrics (`publishedProducts`, `activeVariants`, `activeEmiPlans`, `pendingApplications`, `recentAuditLogs`).

### Product & Variant Management
- `GET /api/v1/admin/products`: List all products (supports pagination & `?search=`).
- `GET /api/v1/admin/products/:id`: Get product details by ID.
- `POST /api/v1/admin/products`: Create product (validates slug uniqueness, audits action).
- `PATCH /api/v1/admin/products/:id`: Update product or publish status.
- `POST /api/v1/admin/variants`: Create variant.
- `PATCH /api/v1/admin/variants/:id`: Update variant.

### EMI Partner & Plan Management
- `GET /api/v1/admin/emi/providers`: List EMI providers.
- `POST /api/v1/admin/emi/providers`: Create EMI provider.
- `PATCH /api/v1/admin/emi/providers/:id`: Update provider active status.
- `GET /api/v1/admin/emi/plans`: List EMI plans.
- `POST /api/v1/admin/emi/plans`: Create EMI plan (validates non-negative financial rates).
- `PATCH /api/v1/admin/emi/plans/:id`: Update EMI plan.

### Customer Applications & Audit
- `GET /api/v1/admin/applications`: List applications (supports `?status=`).
- `PATCH /api/v1/admin/applications/:id/status`: Update application status (`APPROVED`, `REJECTED`, etc.).
- `GET /api/v1/admin/audit-logs`: List immutable administrative audit log stream.
