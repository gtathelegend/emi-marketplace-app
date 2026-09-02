# FinEmi Marketplace — Full-Stack EMI Application

[![Status](https://img.shields.io/badge/Status-Phases%200--9%20Complete-emerald)](file:///d:/Vedaang/Internship/F/emi-marketplace-app/requirements.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.19-lightgrey)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.3-cyan)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-5.19-indigo)](https://www.prisma.io/)

> **Notice**: Production-grade full-stack marketplace implementation completed for the **1Fi SDE1 Engineering Assignment**. All 10 execution phases (Phases 0–9) are complete, hardened, and verified with 42 passing backend Vitest tests and 3 passing frontend Vitest tests.

---

## 1. Project Overview

**FinEmi Marketplace** is a production-grade full-stack EMI e-commerce application. It allows customers to browse electronic products, select specific variants (color, storage), explore dynamic EMI financing options, submit loan applications with server-side financial calculations, and track loan status. Additionally, an administrative console provides catalog management, EMI plan configuration, loan application processing, and immutable audit logs.

### Key Architectural Highlights
- **Layered Backend Architecture**: `Routes -> Middleware -> Controllers -> Services -> Repositories -> Prisma ORM -> PostgreSQL`.
- **Zero-Trust Financial Calculations**: The client submits *only* identifiers (`variantId`, `emiPlanId`). The backend re-fetches authoritative pricing & interest rates and calculates monthly installments server-side inside a database transaction using `Prisma.Decimal`.
- **Immutable Application Snapshots**: When a loan application is submitted, a commercial snapshot is permanently frozen in the database (`productNameSnapshot`, `monthlyAmountSnapshot`, `interestRateSnapshot`, `totalPayableSnapshot`), protecting contract integrity against subsequent catalog edits.
- **Server-Side Admin Security**: HTTP-only JWT cookies (`admin_token`), `bcryptjs` password hashing, `requireAdmin` authorization middleware, and transactional audit logging (`AuditLog`).
- **Architectural Decision Records (ADRs)**: Documented decisions under `docs/decisions/`.

---

## 2. Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, React Router v6, TanStack Query (React Query v5), Lucide Icons |
| **Backend** | Node.js (v20+), Express, TypeScript, Prisma ORM, PostgreSQL, Zod, Helmet, CORS, Rate Limiter, Winston Logger |
| **Testing** | Vitest, Supertest |
| **Infrastructure** | Vercel Edge (Frontend), Render (Backend Web Service), Managed Cloud PostgreSQL (Neon/Supabase) |

---

## 3. Core Features

### Customer Experience
- `/products`: Catalog listing with search, brand/category filtering, allow-listed sorting, and backend pagination.
- `/products/:slug`: Product detail page (PDP) with image gallery switcher, dynamic variant selection (color swatches, storage pills), bank EMI cards, and financing summary box.
- `ApplicationModal`: Checkout dialog with inline Zod validation and mutation.
- `/applications/:applicationNumber`: Immutable snapshot contract tracking view.

### Admin Platform
- `/admin/login`: Secure admin login (`admin@1fi.in` / `Admin@12345`).
- `/admin`: Overview dashboard with live database metrics and activity stream.
- `/admin/products`: Inventory catalog table, search, and publish/unpublish toggle.
- `/admin/products/new` & `/admin/products/:id/edit`: Product & variant editor.
- `/admin/emi`: Bank partner and EMI plan CRUD management.
- `/admin/applications`: Customer application approval/rejection processor.
- `/admin/audit-logs`: Immutable administrative audit trail inspector.

---

## 4. Implementation Status

- [x] **Phase 0 — Architecture ✅**: Requirements matrix, ERD, API specs, Security policies, UX system, Test plan, Demo script, 6 ADRs.
- [x] **Phase 1 — Foundation ✅**: TypeScript config, Express app bootstrap, Helmet, CORS, Zod env validation, Winston request logger, Rate limiting, Centralized error handling, API response envelope, TanStack Query provider, React Router placeholders, Vitest API integration tests.
- [x] **Phase 2 — Domain + Database ✅**: Production 3NF PostgreSQL domain schema (`schema.prisma`), Decimal precision, snapshot terms, deletion restrictions (`ON DELETE RESTRICT`), strategic B-Tree indexing, idempotent seed script.
- [x] **Phase 3 — Backend Core ✅**: ProductRepository, ProductService, ProductController, Zod product schemas, REST endpoints `GET /api/v1/products` and `GET /api/v1/products/:slug`.
- [x] **Phase 4 — Financial / EMI Engine ✅**: Pure `EMICalculator` using `Prisma.Decimal`, reducing-balance and zero-cost formulas, server-authoritative application service, `POST /api/v1/applications` & `GET /api/v1/applications/:applicationNumber`.
- [x] **Phase 5 — Frontend Design System ✅**: Extended Tailwind theme, global CSS focus rings, layout primitives, UI primitives, commerce primitives, header/footer shell.
- [x] **Phase 6 — Customer Experience ✅**: `/products` catalog, `/products/:slug` PDP, application modal, `/applications/:applicationNumber` tracking page.
- [x] **Phase 7 — Admin Platform ✅**: Admin Auth (`POST /admin/auth/login`, `GET /admin/auth/me`), `requireAdmin` middleware, product/variant/EMI CRUD, status processor, transactional audit logging, Admin UI.
- [x] **Phase 8 — Testing & Hardening ✅**: 42 backend Vitest integration tests, 3 frontend Vitest tests, financial edge cases, tampering rejection, snapshot immutability, pagination limits, Prisma error mapping.
- [x] **Phase 9 — Production Polish ✅**: 404 fallback page, modal accessibility focus trapping, date/currency formatting, `.env.example` documentation, security review, portfolio-ready README and docs.
- [ ] **Phase 10 — Deployment + Submission**: Final deployment and demo recording.

---

## 5. Prerequisites & Local Setup

### Prerequisites
- Node.js `v20.x` or higher
- npm `v10.x` or higher
- PostgreSQL `v15+`

### Environment Setup
Copy template environment files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Default Environment Variables (`backend/.env`):
```ini
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fineemi_db?schema=public
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=dev_jwt_secret_key_change_in_production_1fi_2026
JWT_EXPIRES_IN=8h
```

---

## 6. Running Local Services

### Backend Commands
```bash
cd backend
npm install
npm run prisma:generate
npm run seed              # Seeds catalog & demo admin account
npm run dev               # Starts server at http://localhost:5000
```

### Frontend Commands
```bash
cd frontend
npm install
npm run dev               # Starts frontend dev server at http://localhost:5173
```

---

## 7. Verification & Testing

```bash
# Run backend Vitest test suite (42 tests)
cd backend
npm test

# Build backend production TypeScript bundle
cd backend
npm run build

# Run frontend Vitest test suite (3 tests)
cd frontend
npm test

# Build frontend production bundle
cd frontend
npm run build
```

---

## 8. Admin Demo Credentials

For evaluation purposes, the database seed script generates a demo admin account:
- **Email**: `admin@1fi.in`
- **Password**: `Admin@12345`
- **Role**: `SUPER_ADMIN`

*(Note: Production deployments must rotate credentials via environment variables.)*
