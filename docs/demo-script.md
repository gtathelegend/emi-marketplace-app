# Technical Demo Video & Interview Walkthrough Script (3–5 Mins)

## 1. Demo Objectives & Structure
This script guides the 2–5 minute recorded video demonstration for the **1Fi SDE1 Engineering Assignment**. It highlights production software engineering principles: layered architecture, zero-trust financial logic, schema normalization, state management, and administrative auditing.

| Timestamp | Phase | Key Message & Visual Highlight |
|---|---|---|
| **0:00 - 0:45** | **Customer Journey** | Live demo of Product Catalog, Slug routing, Variant switching, Dynamic EMI breakdown, and Application submission |
| **0:45 - 1:30** | **Admin Portal** | Login, product/variant management, EMI plan updates, application status changes, and immutable audit logs |
| **1:30 - 3:00** | **Backend Architecture & Security** | Layered code structure (Controller -> Service -> Repository), Zod validation, and Server-side EMI math execution |
| **3:00 - 4:00** | **Database Schema & Testing** | PostgreSQL schema via Prisma, index design, Vitest unit & integration test execution |
| **4:00 - 4:30** | **Deployment & Wrap Up** | Vercel frontend, Render backend, Cloud PostgreSQL live deployment review |

---

## 2. Minute-by-Minute Script & Narration

### Part 1: Customer Product Discovery & Dynamic EMI (0:00 - 0:45)
- **Visual**: Screen opens on the 1Fi Marketplace catalog. Click on "Apple iPhone 15 Pro".
- **Narration**: *"Welcome to 1Fi Marketplace. I'm presenting our production-grade full-stack EMI marketplace. Notice our SEO-friendly URL `/product/apple-iphone-15-pro`. As I switch between colors and storage capacities—such as 128GB to 256GB—the URL query parameter seamlessly updates while TanStack Query fetches the specific variant's pricing and available EMI plans."*
- **Visual**: Click on the 24-Month No-Cost EMI option. The EMI Summary widget recalculates `₹5,495/mo`. Click "Proceed with EMI Plan". Fill out customer details with PAN `ABCDE1234F` and click "Submit Application".
- **Narration**: *"When I select an EMI plan and proceed to checkout, notice that the frontend sends ONLY the variant ID and EMI plan ID. The frontend is NEVER trusted to calculate interest rates or monthly installments."*

### Part 2: Customer Confirmation & Admin Management (0:45 - 1:30)
- **Visual**: Show generated application confirmation screen with tracking number `1FI-2026-XXXXXX`. Then navigate to `/admin/login`. Log in with admin credentials.
- **Narration**: *"Here is our instantly generated application tracking screen. Now let's switch to the Admin Portal. We authenticate securely via JWT with bcrypt-hashed credentials."*
- **Visual**: Navigate to Admin Dashboard. Show Applications queue. Update status from `PENDING` to `APPROVED`. Navigate to Audit Logs tab. Show the new audit log entry.
- **Narration**: *"In the Admin Console, managers can inspect incoming EMI applications, update status to Approved, and configure EMI plans. Crucially, every administrative mutation triggers an immutable audit log capturing the actor, entity ID, timestamp, IP address, and before/after JSON states."*

### Part 3: Deep-Dive Backend Architecture & Financial Security (1:30 - 3:00)
- **Visual**: Open IDE to `backend/src/services/application.service.ts`.
- **Narration**: *"Let's examine the code architecture. We enforce a strict layered architecture: Routes handle HTTP definitions, Controllers manage status codes, Services enforce business logic, and Repositories wrap Prisma ORM data queries."*
- **Visual**: Highlight `computeEMIBreakdown` function inside `emi.service.ts`.
- **Narration**: *"Here is our core financial calculation engine. When an application is created, the backend transactionally queries the database for authoritative variant pricing and linked plan interest rates. It computes reducing-balance interest using standard financial math formulas and writes the contract snapshot to PostgreSQL."*

### Part 4: Database Model, Testing & Deployment (3:00 - 4:30)
- **Visual**: Show Prisma schema (`schema.prisma`) and terminal window running `npm test`.
- **Narration**: *"Our database model is a fully normalized 3NF PostgreSQL schema with foreign key constraints and strategic B-Tree indexing on slugs, SKUs, and application tracking numbers. In our terminal, running `npm test` executes our Vitest suite, testing EMI calculation edge cases, variant mismatches, invalid PAN inputs, and unauthorized admin attempts."*
- **Visual**: Briefly show deployed Vercel and Render dashboards.
- **Narration**: *"Finally, the application is live: the React frontend is deployed on Vercel Edge CDN, the Express backend runs on Render, and data is persisted in cloud managed PostgreSQL. Thank you!"*
