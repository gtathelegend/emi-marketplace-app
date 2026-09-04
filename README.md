# EMI App

A full-stack EMI marketplace application for browsing products, comparing financing plans, selecting variants, and submitting financing applications. The application uses a database-driven catalog, server-side EMI calculations, REST APIs, PostgreSQL with Prisma ORM, and a responsive React interface with an admin management portal.

---

## Live Demo

| Layer    | URL |
|----------|-----|
| Frontend | [https://emi-app.vedaangsharma.in](https://emi-app.vedaangsharma.in) |
| Backend  | [https://emi-app-backend.vedaangsharma.in/](https://emi-app-backend.vedaangsharma.in/) |

- **Database** is hosted on **Neon** (PostgreSQL)

All API endpoints are versioned under `/api/v1`.

---

## Features

### Customer

- Product catalog with search, brand/category filtering, and sort (price, newest, name)
- Paginated product listings
- Product detail pages with unique URLs (`/products/:slug`)
- Variant selection (color, storage) with dynamic pricing
- MRP vs. selling price with discount display
- Product image gallery per variant
- Product specifications grouped by category
- EMI plan comparison across multiple bank providers
- Zero-cost EMI and interest-bearing EMI options
- Cashback and processing fee display
- Server-side EMI calculation (frontend sends only IDs, not financial values)
- Financing application submission with Zod-validated customer details
- Application tracking by reference number with immutable contract snapshots

### Admin

- Admin authentication (JWT + HTTP-only cookie)
- Dashboard with summary metrics (products, variants, plans, applications)
- Product management (create, update, toggle publish status)
- Variant management (create, update)
- EMI provider management (create, update, toggle active status)
- EMI plan management (create, update, toggle active status)
- Application management (view, update status: Approved/Rejected/Under Review/Cancelled)
- Immutable audit logs for all administrative actions

---

## Application Capabilities

| Capability | Technical Implementation |
|---|---|
| Database-driven catalog | PostgreSQL → Prisma ORM → Express REST API → React frontend |
| Product detail & variant models | `Product`, `ProductVariant` (price, mrp), `ProductImage` models |
| EMI plans (monthly payment, tenure, interest rate) | `EMIPlan` model; server-side `EMICalculator` computes monthly amount |
| Cashback handling | `cashbackAmount` field on `EMIPlan`; deducted from principal |
| Selectable EMI plans | Frontend EMI plan selection sends `emiPlanId` to backend |
| Application submission | `POST /api/v1/applications` with immutable contract snapshot |
| Unique product URLs | `/products/:slug` — e.g. `/products/apple-iphone-15-pro` |
| Multi-category catalog | 15 products seeded across 7 categories |
| Multiple product variants | All 15 products have 2–3 variants each (31 total) |
| React frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v3.4 |
| Backend API | Express REST API under `/api/v1` |
| Database & ORM | PostgreSQL (Neon) via Prisma ORM (11 models) |
| Seed dataset | `backend/prisma/seed.ts` — deterministic, idempotent via upserts |
| Protected admin portal | JWT-authenticated management routes and UI |

---

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** (build tool)
- **Tailwind CSS** v3.4
- **React Router** v6
- **TanStack Query** (React Query v5)
- **Lucide React** (icons)
- **clsx** + **tailwind-merge** (class utilities)

### Backend
- **Node.js** with TypeScript
- **Express** v4
- **Prisma ORM** v5
- **Zod** (request validation)
- **JWT** (jsonwebtoken) + **bcryptjs** (authentication)
- **Helmet** (security headers)
- **CORS** (configurable origin allowlist)
- **Winston** (structured logging)
- **cookie-parser** (admin session cookies)

### Database & Deployment
- **PostgreSQL** (Neon)
- **Vercel** (frontend hosting)
- **Render** (backend hosting)

### Testing
- **Vitest** (test runner)
- **Supertest** (API integration tests)

---

## Architecture

```mermaid
flowchart TD
    A["React + Vite Frontend<br/>(Vercel)"] -->|HTTPS REST API| B["Express Backend<br/>(Render)"]
    B --> C[Routes]
    C --> D[Middleware]
    D --> E[Controllers]
    E --> F[Services]
    F --> G[Repositories]
    G --> H[Prisma ORM]
    H --> I[("PostgreSQL<br/>(Neon)")]
```

### Layered Backend Architecture

```
Routes → Middleware → Controllers → Services → Repositories → Prisma → PostgreSQL
```

| Layer | Responsibility |
|---|---|
| **Routes** | HTTP method + path mapping, Zod schema binding |
| **Middleware** | Auth (JWT), request validation, logging, error handling |
| **Controllers** | Extract validated request data, delegate to services, send responses |
| **Services** | Domain business logic, EMI calculations, application snapshot creation |
| **Repositories** | Prisma query abstractions, data access patterns |
| **Prisma** | Type-safe ORM, migrations, schema management |

This separation enforces single-responsibility — controllers never touch the database directly, services never handle HTTP concerns, and repositories encapsulate all Prisma queries.

---

## Data Flow

### Customer Application Flow

```
Product Page → GET /api/v1/products/:slug
  → Returns product + variants + images + specifications + EMI plans
  → User selects variant → User selects EMI plan
  → Frontend sends { variantId, emiPlanId, customer } (IDs only, no financial values)
  → POST /api/v1/applications
  → Backend loads authoritative product/variant/plan data from database
  → Backend calculates EMI using server-side EMICalculator (Prisma.Decimal)
  → Immutable application snapshot is persisted in a database transaction
  → Application reference number (e.g. 1FI-XXXX-1234) is returned
  → GET /api/v1/applications/:applicationNumber → retrieve frozen contract
```

**Key security property**: The frontend never sends EMI financial values. All monetary calculations are performed server-side using Prisma's `Decimal` type (arbitrary-precision) to avoid JavaScript floating-point errors.

---

## EMI Calculation

The EMI calculator is implemented in [`backend/src/utils/emiCalculator.ts`](backend/src/utils/emiCalculator.ts) using `Prisma.Decimal` for precise decimal arithmetic.

### Principal

```
P = max(0, variant_price − cashback)
```

### Zero-Cost EMI (interest rate = 0% or `isZeroCost = true`)

```
EMI = P / n
```

### Interest-Bearing EMI

```
r = annual_interest_rate / 1200
EMI = P × r × (1+r)^n / ((1+r)^n − 1)
```

### Total Payable

```
Total = (EMI × n) + processing_fee
```

Where `n` = tenure in months. All results are rounded to 2 decimal places using `ROUND_HALF_UP`.

---

## Database Schema

The database is modeled in PostgreSQL using Prisma ORM with **11 models** and **2 enums**.

### Models

| Model | Table | Purpose | Key Fields |
|---|---|---|---|
| `Brand` | `brands` | Product brand taxonomy | `name`, `slug`, `logoUrl` |
| `Category` | `categories` | Product category taxonomy | `name`, `slug`, `description` |
| `Product` | `products` | Core product entity | `title`, `slug` (unique), `basePrice`, `rating`, `isPublished` |
| `ProductVariant` | `product_variants` | SKU-level variant (color, storage, pricing) | `sku` (unique), `colorName`, `colorHex`, `storage`, `price`, `mrp`, `stockQuantity`, `isDefault` |
| `ProductImage` | `product_images` | Variant image gallery | `url`, `altText`, `displayOrder`, `isPrimary` |
| `ProductSpecification` | `product_specifications` | Key-value specifications per variant | `groupName`, `key`, `value`, `displayOrder` |
| `EMIProvider` | `emi_providers` | Bank/financing partner | `name`, `code` (unique), `logoUrl`, `isActive` |
| `EMIPlan` | `emi_plans` | Financing plan per variant-provider pair | `tenureMonths`, `interestRate`, `processingFee`, `cashbackAmount`, `isZeroCost`, `isActive` |
| `EMIApplication` | `emi_applications` | Customer financing application | `applicationNumber` (unique), customer details, immutable financial snapshots |
| `AdminUser` | `admin_users` | Admin accounts | `email` (unique), `passwordHash`, `role` (ADMIN/SUPER_ADMIN) |
| `AuditLog` | `audit_logs` | Immutable admin action records | `action`, `entityType`, `entityId`, `beforeState`, `afterState` |

### Enums

- `ApplicationStatus`: `PENDING`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `CANCELLED`
- `AdminRole`: `ADMIN`, `SUPER_ADMIN`

### Key Relationships

```
Brand ──< Product >── Category
Product ──< ProductVariant
ProductVariant ──< ProductImage
ProductVariant ──< ProductSpecification
ProductVariant ──< EMIPlan >── EMIProvider
ProductVariant ──< EMIApplication >── EMIPlan
AdminUser ──< AuditLog
```

### Application Snapshots

`EMIApplication` stores immutable copies of all commercial values at application time (`productNameSnapshot`, `variantSnapshot`, `providerNameSnapshot`, `skuSnapshot`, `principalAmount`, `interestRateSnapshot`, `tenureMonthsSnapshot`, `monthlyAmountSnapshot`, `cashbackSnapshot`, `totalPayableSnapshot`). If product pricing or EMI plan terms change later, historical applications retain the exact financial terms used at submission.

---

## Seed Data

The seed script ([`backend/prisma/seed.ts`](backend/prisma/seed.ts)) populates the database with a realistic product catalog:

| Entity | Count |
|---|---|
| Brands | 8 (Apple, Samsung, Sony, Google, OnePlus, Dell, Lenovo, Bose) |
| Categories | 7 (Smartphones, Laptops, Audio, Tablets, Smartwatches, Televisions, Gaming) |
| Products | 15 |
| Variants | 31 (2–3 per product) |
| Product Images | 32 |
| Product Specifications | 66 |
| EMI Providers | 4 (HDFC Bank, ICICI Bank, 1Fi Credit, Axis Bank) |
| EMI Plans | 372 (12 plan templates × 31 variants) |
| Admin User | 1 (Super Admin) |

The seed is **idempotent** — it uses `upsert` for products, variants, brands, categories, and providers, and de-duplicates images, specifications, and EMI plans before bulk insertion with `createMany({ skipDuplicates: true })`.

### Example Products

| Product | Brand | Category | Variants |
|---|---|---|---|
| iPhone 15 Pro | Apple | Smartphones | Natural Titanium 128GB, Blue Titanium 256GB, Black Titanium 512GB |
| Galaxy S24 Ultra | Samsung | Smartphones | Titanium Gray 256GB, Titanium Black 512GB |
| MacBook Air M3 | Apple | Laptops | Midnight 256GB, Starlight 512GB |
| Sony WH-1000XM5 | Sony | Audio | Silver, Black |
| PlayStation 5 Slim | Sony | Gaming | Disc Edition, Digital Edition |

---

## API Reference

All endpoints are mounted under `/api/v1`.

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Service health check |

### Products

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/products` | List published products |
| `GET` | `/api/v1/products/:slug` | Get product detail by slug |

**Query Parameters** for `GET /api/v1/products`:

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | `1` | Page number (≥ 1) |
| `limit` | integer | `12` | Items per page (1–50) |
| `search` | string | — | Search query (≤ 100 chars) |
| `brand` | string | — | Filter by brand slug |
| `category` | string | — | Filter by category slug |
| `sort` | enum | `newest` | One of: `newest`, `price_asc`, `price_desc`, `name_asc`, `name_desc` |

### Applications

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/applications` | Submit financing application |
| `GET` | `/api/v1/applications/:applicationNumber` | Track application by reference |

**Request Body** for `POST /api/v1/applications`:

```json
{
  "variantId": "uuid",
  "emiPlanId": "uuid",
  "customer": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "panDemo": "ABCDE1234F"
  }
}
```

### Admin Endpoints (Protected — JWT Required)

#### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/admin/auth/login` | Admin login, returns JWT |
| `GET` | `/api/v1/admin/auth/me` | Get current admin profile |
| `POST` | `/api/v1/admin/auth/logout` | Clear admin session |

#### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/admin/dashboard/summary` | Dashboard metrics and recent activity |

#### Product & Variant Management

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/admin/products` | List all products (including drafts) |
| `GET` | `/api/v1/admin/products/:id` | Get product by ID |
| `POST` | `/api/v1/admin/products` | Create product |
| `PATCH` | `/api/v1/admin/products/:id` | Update product / toggle publish |
| `POST` | `/api/v1/admin/variants` | Create variant |
| `PATCH` | `/api/v1/admin/variants/:id` | Update variant |

#### EMI Provider & Plan Management

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/admin/emi/providers` | List providers |
| `POST` | `/api/v1/admin/emi/providers` | Create provider |
| `PATCH` | `/api/v1/admin/emi/providers/:id` | Update provider |
| `GET` | `/api/v1/admin/emi/plans` | List EMI plans |
| `POST` | `/api/v1/admin/emi/plans` | Create EMI plan |
| `PATCH` | `/api/v1/admin/emi/plans/:id` | Update EMI plan |

#### Application & Audit Management

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/admin/applications` | List applications |
| `PATCH` | `/api/v1/admin/applications/:id/status` | Update application status |
| `GET` | `/api/v1/admin/audit-logs` | View audit trail |

---

## API Example Responses

### Product List — `GET /api/v1/products?limit=1`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Apple iPhone 15 Pro",
      "slug": "apple-iphone-15-pro",
      "subtitle": "Forged in titanium. Powered by A17 Pro.",
      "basePrice": 134900,
      "rating": 4.8,
      "reviewCount": 142,
      "brand": { "id": "uuid", "name": "Apple", "slug": "apple" },
      "category": { "id": "uuid", "name": "Smartphones", "slug": "smartphones" },
      "primaryImage": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
      "defaultVariant": {
        "id": "uuid",
        "sku": "IP15P-128-NAT",
        "title": "iPhone 15 Pro (Natural Titanium, 128GB)",
        "colorName": "Natural Titanium",
        "colorHex": "#888783",
        "storage": "128GB",
        "price": 134900,
        "mrp": 144900,
        "stockQuantity": 15
      }
    }
  ],
  "meta": {
    "timestamp": "2026-09-04T00:00:00.000Z",
    "pagination": {
      "page": 1,
      "limit": 1,
      "total": 15,
      "totalPages": 15
    }
  }
}
```

### Product Detail — `GET /api/v1/products/apple-iphone-15-pro` (truncated)

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Apple iPhone 15 Pro",
    "slug": "apple-iphone-15-pro",
    "brand": { "name": "Apple", "slug": "apple" },
    "category": { "name": "Smartphones", "slug": "smartphones" },
    "variants": [
      {
        "id": "uuid",
        "sku": "IP15P-128-NAT",
        "title": "iPhone 15 Pro (Natural Titanium, 128GB)",
        "price": 134900,
        "mrp": 144900,
        "isDefault": true,
        "images": [{ "url": "...", "altText": "...", "isPrimary": true }],
        "specifications": [{ "groupName": "Display", "key": "Screen Size", "value": "6.1 inches Super Retina XDR OLED" }],
        "emiPlans": [
          {
            "id": "uuid",
            "tenureMonths": 3,
            "interestRate": 0,
            "processingFee": 0,
            "cashbackAmount": 2000,
            "isZeroCost": true,
            "provider": { "id": "uuid", "name": "HDFC Bank", "code": "HDFC_BANK" }
          }
        ]
      }
    ]
  },
  "meta": { "timestamp": "2026-09-04T00:00:00.000Z" }
}
```

### Application Created — `POST /api/v1/applications`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "applicationNumber": "1FI-M1ABC2D-4567",
    "status": "PENDING",
    "appliedAt": "2026-09-04T00:00:00.000Z",
    "customer": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210"
    },
    "contractSnapshot": {
      "productName": "Apple iPhone 15 Pro",
      "variantName": "iPhone 15 Pro (Natural Titanium, 128GB)",
      "providerName": "HDFC Bank",
      "sku": "IP15P-128-NAT",
      "principalAmount": 132900,
      "interestRate": 0,
      "tenureMonths": 3,
      "monthlyAmount": 44300,
      "cashbackAmount": 2000,
      "totalPayable": 132900
    }
  },
  "meta": { "timestamp": "2026-09-04T00:00:00.000Z" }
}
```

### Application Tracking — `GET /api/v1/applications/1FI-M1ABC2D-4567`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "applicationNumber": "1FI-M1ABC2D-4567",
    "status": "PENDING",
    "appliedAt": "2026-09-04T00:00:00.000Z",
    "customer": { "fullName": "John Doe", "email": "john@example.com", "phone": "9876543210" },
    "contractSnapshot": {
      "productName": "Apple iPhone 15 Pro",
      "variantName": "iPhone 15 Pro (Natural Titanium, 128GB)",
      "providerName": "HDFC Bank",
      "sku": "IP15P-128-NAT",
      "principalAmount": 132900,
      "interestRate": 0,
      "tenureMonths": 3,
      "monthlyAmount": 44300,
      "cashbackAmount": 2000,
      "totalPayable": 132900
    },
    "productReference": { "title": "Apple iPhone 15 Pro", "slug": "apple-iphone-15-pro" },
    "providerReference": { "name": "HDFC Bank", "code": "HDFC_BANK", "logoUrl": "/brand/hdfc.svg" }
  },
  "meta": { "timestamp": "2026-09-04T00:00:00.000Z" }
}
```

---

## Local Development

### Prerequisites

- **Node.js** v20+ (with npm)
- **PostgreSQL** (local instance or a hosted provider like Neon)

### 1. Clone the Repository

```bash
git clone https://github.com/gtathelegend/emi-marketplace-app.git
cd emi-marketplace-app
```

### 2. Configure Environment Variables

**Backend** (`backend/.env`):

```ini
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fineemi_db?schema=public
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=dev_jwt_secret_key_change_in_production_1fi_2026
JWT_EXPIRES_IN=8h
```

**Frontend** (`frontend/.env`):

```ini
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### 3. Backend Setup

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Backend starts on `http://localhost:5000`.

### 4. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend starts on `http://localhost:5173`.

### 5. Database Inspection (Optional)

```bash
cd backend
npx prisma studio
```

Opens Prisma Studio at `http://localhost:5555` for visual database browsing.

---

## Testing

### Backend (42 tests)

```bash
cd backend
npm test
```

Tests cover:
- Health check endpoint and error envelope format
- Product listing (pagination, search, filters, sorting, validation)
- Product detail by slug (nested variants, 404 handling, slug validation)
- EMI calculator (zero-cost, interest-bearing, cashback, precision, edge cases)
- Application creation (server-authoritative snapshots, tampering rejection, validation)
- Application tracking (snapshot retrieval, 404 handling)
- Admin authentication (login, token validation, inactive accounts)
- Admin CRUD operations (products, EMI plans, application status, audit logs)

### Frontend (3 tests)

```bash
cd frontend
npm test
```

Tests cover:
- Tailwind class merge utility (`cn` helper)
- INR currency formatting

### Production Build

```bash
cd backend && npm run build
cd frontend && npm run build
```

---

## Security & Engineering Practices

| Practice | Implementation |
|---|---|
| Request validation | Zod schemas on all API endpoints |
| Authentication | JWT tokens with configurable expiry |
| Session management | HTTP-only cookies for admin sessions, Bearer token support |
| Password hashing | bcryptjs with salt rounds |
| Security headers | Helmet middleware |
| CORS | Configurable origin allowlist |
| Error handling | Centralized error middleware with typed `AppError` hierarchy |
| Server-side financial calculation | `EMICalculator` uses `Prisma.Decimal` — frontend never sends monetary values |
| Immutable application snapshots | `EMIApplication` preserves exact financial terms at submission time |
| Audit logging | All admin mutations recorded with before/after state in `AuditLog` |
| Environment validation | Zod-validated `env.ts` — server refuses to start with invalid config |
| Structured logging | Winston logger with request correlation IDs |
| Graceful shutdown | SIGTERM/SIGINT handlers close HTTP server and database connection |

---

## Engineering Decisions

**PostgreSQL** — Relational storage is a natural fit for products → variants → plans → applications with strong referential integrity, and for financial data requiring precise decimal types.

**Layered architecture** — Routes → Controllers → Services → Repositories cleanly separates HTTP concerns, domain logic, and data access. This makes each layer independently testable and replaceable.

**Server-side EMI calculation** — Financial values are computed server-side using `Prisma.Decimal` (arbitrary-precision) to prevent floating-point rounding errors and ensure the backend remains the single source of truth.

**Application snapshots** — `EMIApplication` stores frozen copies of all commercial values (product name, variant, provider, principal, EMI amount, interest rate, cashback, total payable). Historical applications are unaffected by future price or plan changes.

**API versioning** — All routes are namespaced under `/api/v1`, allowing future API evolution without breaking existing clients.

**Decimal money handling** — All monetary columns use `Decimal(10, 2)` in PostgreSQL. The EMI calculator operates on `Prisma.Decimal` objects rather than JavaScript `number` to avoid IEEE-754 floating-point imprecision.

---

## Project Structure

```
emi-marketplace-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma           # 11-model database schema
│   │   └── seed.ts                 # Idempotent catalog seed (15 products, 31 variants, 372 EMI plans)
│   ├── src/
│   │   ├── config/                 # Environment validation (Zod) & Prisma client
│   │   ├── controllers/            # Request/response handlers
│   │   ├── errors/                 # Typed AppError hierarchy
│   │   ├── middleware/             # Admin JWT auth middleware
│   │   ├── middlewares/            # Validation, error handler, request logger
│   │   ├── repositories/          # Prisma data-access abstractions
│   │   ├── routes/                # Express API v1 route definitions
│   │   ├── schemas/               # Zod request validation schemas
│   │   ├── services/              # Domain logic & EMI calculations
│   │   ├── tests/                 # Vitest API integration test suite (42 tests)
│   │   ├── utils/                 # EMI calculator, API response helpers, logger
│   │   ├── app.ts                 # Express application factory
│   │   └── server.ts              # Server entry point with graceful shutdown
│   └── package.json
│
├── frontend/
│   ├── public/                    # Static assets and brand logos
│   ├── src/
│   │   ├── app/                   # Root providers, layouts & router
│   │   ├── features/
│   │   │   ├── admin/             # Admin portal, dashboard & management
│   │   │   ├── application/       # Application tracking page
│   │   │   ├── catalog/           # Marketplace catalog & filters
│   │   │   ├── emi/               # EMI selection components
│   │   │   └── product/           # Product detail, variants & EMI selection
│   │   └── shared/                # Reusable UI components, hooks, API client & types
│   └── package.json
│
└── docs/                          # Technical architecture & design documentation
```

---

## Deployment

### Production Topology

```
┌─────────────────────────┐
│  Frontend (Vercel)       │
│  React + Vite SPA       │
│  emi-app.vedaangsharma.in│
└────────┬────────────────┘
         │ HTTPS REST API
         ▼
┌─────────────────────────┐
│  Backend (Render)        │
│  Node.js + Express       │
│  emi-app-backend.        │
│  vedaangsharma.in        │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Database (Neon)         │
│  PostgreSQL              │
└─────────────────────────┘
```

The frontend is a static SPA deployed on Vercel. The backend runs as a standalone Node.js process on Render, connecting directly to Neon PostgreSQL.

---

## Project Status

- [x] Frontend deployed (Vercel)
- [x] Backend deployed (Render)
- [x] PostgreSQL database deployed (Neon)
- [x] Seed data included
- [x] Automated tests included

---

## Demo Video

> **Demo Video**: `VIDEO_LINK_TO_BE_ADDED`
>
> The demo walks through the product catalog, product details, variant selection, EMI plans, financing application flow, backend API, and database.

---

## Notes

- Financial calculations are performed exclusively server-side; the frontend sends only entity IDs.
- Production database credentials are never committed to the repository.
- Environment variables are required for both frontend and backend — see `.env.example` files.
- The admin credentials (`admin@1fi.in` / `Admin@12345`) are seeded demo credentials for testing and administration.
- All monetary values in the database use `Decimal(10, 2)` to ensure precise financial arithmetic.
- All API routes are versioned under `/api/v1`.
