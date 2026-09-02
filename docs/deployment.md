# Deployment & Production Operations Guide — FinEmi Marketplace

## 1. High-Level Production Architecture

```
                     PRODUCTION ARCHITECTURE
                            │
         ┌──────────────────┴──────────────────┐
         │                                     │
   Vercel / Netlify                      Render / Railway
  (Frontend SPA Edge)                  (Backend Node Service)
   Static HTML / JS                      Express REST API
         │                                     │
   VITE_API_BASE_URL                    PORT / CORS_ORIGIN
         │                                     │
         └──────────────────┬──────────────────┘
                            │
                            ▼
                    Neon / Supabase
                (Managed PostgreSQL 15+)
```

---

## 2. Environment Variable Reference

### 2.1 Backend Web Service Environment Configuration (`backend/.env`)

| Variable Name | Production Description | Example Value |
|---|---|---|
| `PORT` | HTTP port provided by hosting environment | `5000` or `10000` |
| `NODE_ENV` | Application environment mode | `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@ep-prod.neon.tech/fineemi?sslmode=require` |
| `CORS_ORIGIN` | Authorized frontend origin | `https://fineemi-marketplace.vercel.app` |
| `JWT_SECRET` | Secret key for signing admin JWT tokens | `prod_super_secret_key_change_before_deploy_2026` |
| `JWT_EXPIRES_IN` | JWT token validity duration | `8h` |

### 2.2 Frontend Static Build Environment Configuration (`frontend/.env`)

| Variable Name | Production Description | Example Value |
|---|---|---|
| `VITE_API_BASE_URL` | Production REST API base URL | `https://fineemi-api.onrender.com/api/v1` |

---

## 3. Production Database Initialization & Migration

### Step 3.1: Execute Prisma Migrations
Run production-safe schema migrations using `prisma migrate deploy` (never use `db push` in production):

```bash
cd backend
npx prisma migrate deploy
```

### Step 3.2: Seed Initial Assignment Catalog Data
Seed initial products, variants, bank EMI providers, financing plans, and demo admin user:

```bash
cd backend
npx prisma db seed
```

*(Note: The seed script is idempotent and safe to run on fresh databases. Do not run automatically on server restart.)*

---

## 4. Production Security & Cookie Strategy

- **HTTP-Only Cookies**: Admin tokens are issued in HTTP-only `admin_token` cookies with `SameSite=Lax` and `Secure=true` in `NODE_ENV=production`.
- **CORS Protection**: Access is restricted strictly to the origin specified in `CORS_ORIGIN` with `credentials: true`.
- **Server Financial Authority**: The client submits only `variantId` and `emiPlanId`. The backend calculates all monetary values and contract terms server-side inside a database transaction.
- **Sanitized Errors**: In production mode (`NODE_ENV=production`), unhandled internal server errors return generic message `An unexpected internal server error occurred.` without exposing stack traces or database schema internals.

---

## 5. Production Smoke Test Verification Checklist

1. **Health Verification**:
   ```http
   GET https://fineemi-api.onrender.com/api/v1/health
   ```
   Expect HTTP 200 `{ "success": true, "data": { "status": "healthy" } }`.

2. **Customer Flow Smoke Test**:
   - Navigate to catalog page `/products`.
   - Open product `/products/apple-iphone-15-pro`.
   - Switch variant swatch to Natural Titanium (128GB).
   - Select HDFC Bank 6-Month 0% EMI card.
   - Fill demo customer details and submit application.
   - Verify tracking page `/applications/1FI-XXXX` renders immutable snapshot contract terms.

3. **Admin Flow Smoke Test**:
   - Open `/admin/login`.
   - Sign in with demo master admin credentials (`admin@1fi.in` / `Admin@12345`).
   - Confirm `/admin` dashboard displays live database metrics.
   - Verify unauthenticated requests to `/api/v1/admin/dashboard/summary` return HTTP 401 `AUTHENTICATION_ERROR`.
