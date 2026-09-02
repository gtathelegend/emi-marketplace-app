# Technical Interview & Demo Script — FinEmi Marketplace

## 1. Demo Narrative Overview

This demo walkthrough demonstrates the end-to-end architecture and customer journey of **FinEmi Marketplace**.

---

## 2. Step-by-Step Demo Flow

### Step 1: Catalog Browsing & Search
- Open `http://localhost:5173/products`.
- Demonstrate live catalog search (e.g. search `"iPhone"` or `"S24"`).
- Demonstrate brand filtering (select `Apple` or `Samsung`) and category filtering.
- Demonstrate allow-listed sorting (e.g., `Price: Low to High`).
- Show responsive `ProductCard` items displaying primary image, selling price, MRP strike-through, and starting monthly EMI badge.

### Step 2: Product Detail Page & Variant Switching
- Click on **Apple iPhone 15 Pro** (`/products/apple-iphone-15-pro`).
- Demonstrate image gallery thumbnail switching.
- Demonstrate variant switching: Switch between `Natural Titanium (128GB)` and `Blue Titanium (256GB)`. Point out that selecting a variant updates selling price, MRP, gallery images, specifications, and available `EmiPlanCard` financing options.

### Step 3: EMI Plan Selection & Financing Summary
- Select **HDFC Bank 6-Month Zero Cost EMI** plan.
- Point out the instant ₹3,000 cashback badge and 0% interest rate.
- Highlight the **Financing Breakdown** summary card displaying net principal financed, monthly installment, and processing fee.
- Explain: *"Notice that the frontend does not calculate the EMI; it displays authoritative backend financial quotes."*

### Step 4: Checkout & Application Submission
- Click **Apply for EMI**.
- Enter safe demo applicant details:
  - Full Name: `Rahul Verma`
  - Email: `rahul.verma@example.com`
  - Phone: `9876543210`
- Click **Submit Application**. Point out the loading spinner and button disable state preventing duplicate submissions.

### Step 5: Application Tracking & Snapshot Immutability
- Upon submission, the app navigates automatically to `/applications/1FI-2026-XXXX`.
- Highlight the **Immutable Commercial Contract Snapshot**:
  - `Application Reference`: `1FI-2026-XXXX`
  - `Status`: `PENDING`
  - `Principal Financed`, `Monthly Installment`, `Interest Rate`, `Cashback Amount`, `Total Payable`.
- Explain: *"Even if the bank later changes interest rates or product catalog prices, this stored application snapshot remains completely frozen and tamper-proof."*
