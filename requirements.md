# EMI App — System Requirements & Feature Matrix

## 1. Overview
**EMI App** is a production-grade full-stack EMI marketplace application. It enables customers to discover products, select specific variants (color, storage), explore dynamic EMI options with real-time financial transparency, submit finance applications, and track their applications. Additionally, it provides an admin console for catalogue, variant, EMI plan, application management, and immutable audit logs.

---

## 2. Feature & Technical Implementation Matrix

| # | Feature Category | Feature Specification | Technical Implementation | Acceptance Criteria |
|---|---|---|---|---|
| 1 | **Frontend Tech** | React, Tailwind CSS | React 18, TypeScript, Tailwind CSS, Vite, Lucide Icons, Headless UI / Radix primitives | Fast build, type-safe components, modern fintech aesthetic with zero generic styling |
| 2 | **Backend Tech** | Node.js, Express | Node.js (v20+), Express.js, TypeScript, Layered Architecture | Modular routes, controllers, services, repositories, middleware |
| 3 | **Database & ORM** | PostgreSQL or equivalent | PostgreSQL + Prisma ORM | Fully normalized schema, primary/foreign keys, foreign constraints, indexes, migrations |
| 4 | **Data Dynamic API** | Dynamic API-driven data | RESTful JSON API with Zod validation, OpenAPI docs | Zero static mock data in frontend components; all fetched dynamically via TanStack Query |
| 5 | **Catalog Volume** | At least 3 products, 2 variants per product | 4 distinct products (e.g. iPhone 15 Pro, Samsung S24 Ultra, MacBook Air M3, Sony WH-1000XM5) with 2–3 variants each | Seed script populates products with multiple colors, storage variants, prices, and imagery |
| 6 | **EMI Plans** | Multiple EMI plans per variant | 3–6 EMI plans per variant (3, 6, 9, 12, 18, 24 months, standard & zero-cost EMI, multiple partner banks) | Calculated tenure, interest rates, down payments, processing fees, and cashbacks per plan |
| 7 | **Product URLs** | Unique product URLs | SEO-friendly slug-based routing (`/product/:slug`) with query param state sync (`?variant=id&emi=id`) | Deep-linkable product pages preserving selected variant and EMI selection |
| 8 | **Product Details** | Pricing, images, specs, EMI monthly amount, tenure, interest, cashback | Full Snapmint-inspired information architecture (Gallery, Variants, EMI breakdown, Specs table, Cashback tags) | Displays accurate monthly breakdown, down payment, total interest, and net effective price |
| 9 | **EMI Checkout** | EMI selection & application submission | Interactive EMI plan selector, checkout modal/page, server-verified financial calculations | Submits variant ID + EMI plan ID + customer details; backend performs authoritative math |
| 10| **Admin Portal** | Product, variant, EMI plan, application management, audit log | Secured admin routing (`/admin`), JWT auth, CRUD dashboards, status workflow, audit trail | Full CRUD capabilities with administrative audit logging for all mutations |
| 11| **Security & Auth** | Protected admin endpoints, hashed passwords, safe errors | `bcryptjs` hashing, JWT stateless auth, Helmet headers, centralized error handling | Secrets loaded from environment; zero unhandled stack traces returned to client |
| 12| **Testing** | Comprehensive unit & integration testing | Vitest / Supertest for backend services & APIs; React Testing Library for frontend flows | Automated tests for EMI calculation, validation errors, mismatch handling, component flows |
| 13| **Deployment** | Vercel (Frontend), Render/Railway (Backend), PostgreSQL (Managed cloud) | Vercel SPA deployment + Render Web Service + Managed PostgreSQL (Neon / Supabase) | Fully deployed live environment with environment variable isolation |
| 14| **Documentation** | Architectural docs, API specs, DB design, UX decisions, Demo script | Complete `docs/` suite covering architecture, DB, API, security, testing, UX, and video script | Detailed technical documentation ready for code review and interview defense |

---

## 3. Non-Functional Requirements (NFRs)

### NFR-1: Financial Integrity & Zero Frontend Trust
- The frontend **MUST NOT** transmit calculated monetary values (such as `monthlyInstallment`, `totalInterest`, or `interestRate`) during checkout submission.
- The backend **MUST** re-fetch variant pricing, EMI plan rates, and calculate amounts transactionally.

### NFR-2: Performance & Server State
- Initial catalog load time under **1.2s**.
- API response latency < **150ms** for read operations, < **300ms** for application creation.
- TanStack Query used for caching, background revalidation, and optimistic state handling.

### NFR-3: Observability & Logging
- Every HTTP request receives a unique `x-request-id` (Correlation ID).
- Structured JSON logging using Winston/Pino.

### NFR-4: Modern Visual Aesthetics & Responsiveness
- Premium fintech dark/light theme options, responsive mobile-first layouts with sticky EMI checkout CTA bars for mobile viewport.
- Skeleton loading screens and fallback error states for all API-driven views.
