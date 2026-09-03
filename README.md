# FinEmi Marketplace

A full-stack marketplace application where users can browse products, compare variants, view flexible EMI financing plans, and submit financing applications.

## Live Demo

- **Frontend**: [https://emi-marketplace-app.vercel.app/](https://emi-marketplace-app.vercel.app/)
- **Backend API**: [https://emi-marketplace-app.onrender.com/](https://emi-marketplace-app.onrender.com/)
- **Health Check**: [https://emi-marketplace-app.onrender.com/api/v1/health](https://emi-marketplace-app.onrender.com/api/v1/health)

---

## Features

- **Product Catalog**: Search, filter by brand/category, sort by price/recency, and browse paginated inventory.
- **Product Variants**: Switch color swatches, storage capacities, and dynamic image galleries.
- **EMI Comparison**: Compare bank partners, interest rates (standard & zero-cost), processing fees, and cashback offers.
- **Server-Side Calculations**: Reliable financial installments computed directly on the backend.
- **Financing Application Flow**: Apply for financing plans with form validation and instant tracking references.
- **Application Tracking**: View submitted financing application details with persistent contract snapshots.
- **Admin Dashboard**: Overview metrics for products, variants, active EMI plans, and pending applications.
- **Admin Management**: Manage products, variants, bank providers, EMI plans, and application statuses.
- **Audit Logging**: Immutable logging for administrative changes and operations.

---

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State & Data Fetching**: TanStack Query (React Query v5)
- **Routing**: React Router v6
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js (v20+) with TypeScript
- **Web Framework**: Express
- **Database ORM**: Prisma ORM
- **Validation**: Zod
- **Security & Auth**: JWT authentication, bcryptjs, Helmet, CORS, Rate Limiting

### Database & Deployment
- **Database**: PostgreSQL (Neon)
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render

---

## Project Structure

```
emi-marketplace-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema definition
│   │   └── seed.ts             # Initial catalog and admin seed script
│   ├── src/
│   │   ├── config/             # Environment validation & app constants
│   │   ├── controllers/        # Request/response handlers
│   │   ├── errors/             # Custom application error classes
│   │   ├── middleware/         # Auth, validation, logging & rate-limiters
│   │   ├── repositories/       # Prisma data-access abstractions
│   │   ├── routes/             # Express API v1 route definitions
│   │   ├── services/           # Domain business logic & EMI calculations
│   │   ├── tests/              # Vitest API integration test suite
│   │   ├── app.ts              # Express application factory
│   │   └── server.ts           # Server entry point
│   └── package.json
│
├── frontend/
│   ├── public/                 # Static assets and brand logos
│   ├── src/
│   │   ├── app/                # Root providers, layouts & router
│   │   ├── features/
│   │   │   ├── admin/          # Admin portal, dashboard & management
│   │   │   ├── application/    # Application tracking page
│   │   │   ├── catalog/        # Marketplace catalog & filters
│   │   │   └── product/        # Product detail, variants & EMI selection
│   │   └── shared/             # Reusable UI components, hooks & API client
│   └── package.json
│
└── docs/                       # Technical architecture & design documentation
```

---

## REST API Reference

All API routes are mounted under `/api/v1`:

### Public Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Service health check |
| `GET` | `/api/v1/products` | List published products with search, filters & pagination |
| `GET` | `/api/v1/products/:slug` | Get detailed product information by slug with variants & EMI plans |
| `POST` | `/api/v1/applications` | Submit a financing application |
| `GET` | `/api/v1/applications/:applicationNumber` | Track an application by reference number |

### Admin Endpoints (Protected)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/admin/auth/login` | Authenticate admin user & receive JWT token |
| `GET` | `/api/v1/admin/auth/me` | Fetch active admin user profile |
| `POST` | `/api/v1/admin/auth/logout` | Clear admin session |
| `GET` | `/api/v1/admin/dashboard/summary` | Fetch dashboard counts and recent activity |
| `GET` | `/api/v1/admin/products` | List all products (published and drafts) |
| `POST` | `/api/v1/admin/products` | Create a new product |
| `PATCH` | `/api/v1/admin/products/:id` | Update product details or toggle publish status |
| `POST` | `/api/v1/admin/variants` | Add a new variant to a product |
| `GET` | `/api/v1/admin/emi/providers` | List bank financing partners |
| `POST` | `/api/v1/admin/emi/providers` | Create a bank financing partner |
| `PATCH` | `/api/v1/admin/emi/providers/:id` | Toggle provider active status |
| `GET` | `/api/v1/admin/emi/plans` | List configured EMI plans |
| `POST` | `/api/v1/admin/emi/plans` | Create a new EMI financing plan |
| `PATCH` | `/api/v1/admin/emi/plans/:id` | Toggle EMI plan active status |
| `GET` | `/api/v1/admin/applications` | List customer financing applications |
| `PATCH` | `/api/v1/admin/applications/:id/status` | Update application status (`APPROVED`, `REJECTED`, etc.) |
| `GET` | `/api/v1/admin/audit-logs` | View administrative audit trail |

---

## Database Model

The database is modeled in PostgreSQL using Prisma ORM:

- **Brand & Category**: Product organization and taxonomy.
- **Product & ProductVariant**: Products with color, storage, pricing (MRP and selling price), and inventory.
- **ProductImage & Specification**: Media galleries and technical specification key-values per variant.
- **EMIProvider & EMIPlan**: Financial partners and customizable financing terms (tenure, interest rate, cashback, processing fee, zero-cost flag).
- **EMIApplication**: Customer loan submissions with immutable snapshot contracts storing frozen terms at application time.
- **AdminUser & AuditLog**: Administrative accounts and transactional change records.

---

## Local Development

### 1. Clone the Repository
```bash
git clone https://github.com/gtathelegend/emi-marketplace-app.git
cd emi-marketplace-app
```

### 2. Configure Environment Variables

**Backend (`backend/.env`):**
```ini
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fineemi_db?schema=public"
CORS_ORIGIN="http://localhost:5173"
JWT_SECRET="dev_jwt_secret_key_change_in_production_1fi_2026"
JWT_EXPIRES_IN="8h"
```

**Frontend (`frontend/.env`):**
```ini
VITE_API_BASE_URL="http://localhost:5000/api/v1"
```

### 3. Backend Setup
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```
Backend will start on `http://localhost:5000`.

### 4. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend will start on `http://localhost:5173`.

---

## Running Tests & Building

### Backend Tests & Build
```bash
cd backend
npm test -- --run     # Run Vitest test suite (42 tests)
npm run build         # Compile TypeScript production bundle
```

### Frontend Tests & Build
```bash
cd frontend
npm test -- --run     # Run Vitest component tests (3 tests)
npm run build         # Build production Vite bundle
```

---

## Admin Demo Credentials

For testing administrative workflows, the seed script creates a default administrator:
- **Email**: `admin@1fi.in`
- **Password**: `Admin@12345`
- **Portal URL**: `/admin/login`
