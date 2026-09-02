# FinEmi Marketplace — Full-Stack EMI Application

[![Phase 1 Complete](https://img.shields.io/badge/Status-Phase%201%3A%20Foundation%20Complete-emerald)](file:///d:/Vedaang/Internship/F/emi-marketplace-app/requirements.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.19-lightgrey)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.3-cyan)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-5.19-indigo)](https://www.prisma.io/)

> **Notice**: This application is currently under active development for the **1Fi SDE1 Engineering Assignment**. Phase 0 (Architecture & Design) and Phase 1 (Foundation) are fully implemented and verified. Domain logic, Prisma database models, and UI pages will be implemented in subsequent phases.

---

## 1. Project Overview

**FinEmi Marketplace** is a production-grade full-stack EMI e-commerce application. It allows customers to browse electronic products, select specific variants (color, storage), explore dynamic EMI financing options, submit loan applications with server-side financial calculations, and track loan status. Additionally, an administrative console provides catalog management, EMI plan configuration, loan application processing, and immutable audit logs.

### Key Architectural Highlights
- **Layered Architecture**: `Routes -> Middleware -> Controllers -> Services -> Repositories -> Prisma ORM -> PostgreSQL`.
- **Zero-Trust Financial Calculations**: The client submits *only* identifiers (`variantId`, `emiPlanId`). The backend re-fetches authoritative pricing & interest rates and calculates monthly installments server-side inside a database transaction.
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

## 3. Repository Structure

```
emi-marketplace-app/
├── requirements.md                   # Assignment requirements & NFRs matrix
├── README.md                         # Project documentation
├── docs/                             # System design documentation
│   ├── architecture.md               # System & layered architecture specs
│   ├── database-design.md            # ERD, database schema & index design
│   ├── api-design.md                 # REST API endpoints, Zod schemas & error matrix
│   ├── security.md                   # Security headers, auth & financial rules
│   ├── testing.md                    # Vitest/Supertest testing strategy & test matrix
│   ├── ux-decisions.md               # PDP layout, color system & state management
│   ├── demo-script.md                # 2-5 minute technical video demo script
│   └── decisions/                    # Architectural Decision Records (ADRs)
│       ├── 001-postgresql.md
│       ├── 002-layered-backend.md
│       ├── 003-emi-snapshot.md
│       ├── 004-api-versioning.md
│       ├── 005-server-state.md
│       └── 006-admin-auditing.md
├── backend/                          # Express + TypeScript REST API Server
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   ├── .env.example
│   ├── prisma/
│   │   └── schema.prisma             # Prisma database schema foundation
│   └── src/
│       ├── server.ts                 # HTTP server bootstrap & graceful shutdown
│       ├── app.ts                    # Express app initialization & middleware stack
│       ├── config/                   # Validated environment & Prisma client
│       ├── routes/                   # Route namespaces (/api/v1/)
│       ├── controllers/              # HTTP controllers
│       ├── services/                 # Business logic & health check service
│       ├── repositories/             # Prisma data access abstractions
│       ├── middlewares/              # Security, logger, rate limiter, error handler, Zod validator
│       ├── errors/                   # Custom domain exception hierarchy
│       ├── utils/                    # Structured logger & API response helpers
│       └── tests/                    # Vitest + Supertest integration tests
└── frontend/                         # React 18 + TypeScript + Vite Frontend
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── .env.example
    └── src/
        ├── app/                      # Router, Providers & Layouts
        ├── features/                 # Modular domain features (catalog, product, emi, applications, admin)
        └── shared/                   # Reusable API client, components, hooks & utils
```

---

## 4. Current Implementation Status

- [x] **Phase 0 — Architecture ✅**: Requirements matrix, ERD, API specs, Security policies, UX system, Test plan, Demo script, 6 ADRs.
- [x] **Phase 1 — Foundation ✅**: TypeScript config, Express app bootstrap, Helmet, CORS, Zod env validation, Winston request logger, Rate limiting, Centralized error handling, API response envelope, TanStack Query provider, React Router placeholders, Vitest API integration tests.
- [ ] **Phase 2 — Domain + Database**: Final 3NF PostgreSQL schema, migrations, indexes, seed data script.
- [ ] **Phase 3 — Backend Core**: Repositories → services → controllers → routes → validation.
- [ ] **Phase 4 — Financial/EMI Engine**: Calculation formulas, contract snapshots, transactional submission.
- [ ] **Phase 5 — Frontend Design System**: Design tokens, UI primitives (Buttons, Cards, Badges, Modals, Skeletons).
- [ ] **Phase 6 — Customer Experience**: Catalog page, PDP view, variant switcher, EMI plan selection, checkout modal, tracking screen.
- [ ] **Phase 7 — Admin Platform**: Auth, JWT guard, catalog CRUD, application queue management, audit log viewer.
- [ ] **Phase 8 — Testing & Hardening**: E2E test suites, edge case verification, security review.
- [ ] **Phase 9 — Production Polish**: Performance tuning, accessibility checks, responsive UX, SEO metadata.
- [ ] **Phase 10 — Deployment + Submission**: Live deployment, demo video recording, final delivery.

---

## 5. Prerequisites & Environment Setup

### Prerequisites
- Node.js `v20.x` or higher
- npm `v10.x` or higher
- PostgreSQL `v15+` (for Phase 2 onwards)

### Environment Configuration
Copy template environment files before starting services:

```bash
# Backend environment setup
cp backend/.env.example backend/.env

# Frontend environment setup
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

## 6. Local Development Commands

### Backend Commands
```bash
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Start backend dev server (watch mode)
npm run dev

# Run Vitest API integration tests
npm run test

# Run TypeScript build
npm run build
```

### Frontend Commands
```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build production bundle
npm run build
```

---

## 7. Canonical Health Endpoint Verification

Once the backend is running (`npm run dev` in `backend/`), verify system status:

**Request**:
```http
GET http://localhost:5000/api/v1/health
```

**Response (`200 OK`)**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-09-02T21:35:00.000Z",
    "uptimeSeconds": 12
  },
  "meta": {
    "requestId": "req_abc123xyz",
    "timestamp": "2026-09-02T21:35:00.000Z"
  }
}
```
