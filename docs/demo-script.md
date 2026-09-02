# Technical Interview & Demo Script — FinEmi Marketplace

## 1. Demo Narrative Overview

This demo walkthrough demonstrates the end-to-end customer journey, administrative management, and architectural security of **FinEmi Marketplace**.

---

## 2. Step-by-Step Demo Flow

### Part 1: Customer Journey (Catalog → PDP → EMI → Checkout → Tracking)

1. **Catalog Browsing & Search (`/products`)**:
   - Open `http://localhost:5173/products`.
   - Demonstrate live search (e.g. search `"iPhone"` or `"S24"`).
   - Demonstrate brand filtering (`Apple`, `Samsung`) and sorting.
   - Show responsive `ProductCard` presentation displaying starting monthly EMI badges and prices.

2. **Product Detail Page & Variant Selection (`/products/:slug`)**:
   - Click **Apple iPhone 15 Pro** (`/products/apple-iphone-15-pro`).
   - Demonstrate image gallery thumbnail switching.
   - Select variant swatches (`Natural Titanium (128GB)` vs `Blue Titanium (256GB)`).
   - Point out that changing variant dynamically updates selling price, MRP, gallery, specs, and bank EMI cards.

3. **EMI Plan Selection & Financing Summary**:
   - Select **HDFC Bank 6-Month Zero Cost EMI** plan card.
   - Highlight the ₹3,000 promotional cashback badge, 0% interest rate, and financing breakdown box.
   - Explain: *"The frontend NEVER calculates financial values; it displays authoritative backend financial calculations."*

4. **Application Checkout Modal**:
   - Click **Apply for EMI**.
   - Enter demo customer contact details (`Rahul Verma`, `rahul.verma@example.com`, `9876543210`).
   - Click **Submit Application**. Point out button loading state preventing duplicate clicks.

5. **Application Snapshot Contract Tracking (`/applications/:applicationNumber`)**:
   - Automatically navigates to `/applications/1FI-XXXX`.
   - Highlight the **Immutable Contract Snapshot**: Reference number, status (`PENDING`), net principal, monthly installment, interest rate, cashback, and total payable.
   - Explain: *"Even if catalog prices or bank interest rates change tomorrow, this customer's application contract snapshot remains frozen and immutable."*

---

### Part 2: Admin Platform Walkthrough (`/admin`)

1. **Admin Authentication & Dashboard (`/admin/login` & `/admin`)**:
   - Open `http://localhost:5173/admin/login`.
   - Sign in with demo master admin credentials (`admin@1fi.in` / `Admin@12345`).
   - Show `/admin` overview dashboard with real-time metrics (published products, active variants, active EMI plans, pending applications) and recent activity stream.

2. **Catalog & EMI Management (`/admin/products` & `/admin/emi`)**:
   - View `/admin/products`. Toggle publish status on a product.
   - View `/admin/emi`. Add a new bank provider or toggle an EMI plan's active status.

3. **Application Status Processing (`/admin/applications`)**:
   - View `/admin/applications`. Locate customer application `1FI-XXXX`.
   - Click **Approve**. Show status transition to `APPROVED`.

4. **Administrative Audit Log (`/admin/audit-logs`)**:
   - Open `/admin/audit-logs`. Point out the recorded audit log (`UPDATE_APPLICATION_STATUS` by `FinEmi Master Admin`).

---

### Part 3: Engineering Architecture & Security Overview

- **Layered Architecture**: Routes → Middleware → Controllers → Services → Repositories → Prisma → PostgreSQL.
- **Server-Side Security**: HTTP-only JWT cookies (`admin_token`), `bcryptjs` password hashing, `requireAdmin` middleware revalidating active status on every request.
- **Zero-Trust Financial Authority**: Server loads database prices, verifies active relationships, and computes `EMICalculator` terms using `Prisma.Decimal`. Client tampering is ignored.
- **Testing & Verification**: 42 backend Vitest integration tests & 3 frontend Vitest tests passing with 0 build errors.
