# Financial & EMI Calculation Engine Specification — FinEmi Marketplace

## 1. Executive Summary & Design Principles

The **FinEmi Marketplace Financial Engine** is an authoritative, server-side loan calculation system. It guarantees that customers receive transparent, tamper-proof EMI financing options while preserving complete contract snapshot history for administrative auditing.

### Key Financial Principles
1. **Zero-Trust Client Submissions**: Clients submit **ONLY** `variantId`, `emiPlanId`, and applicant contact details. The backend strictly ignores any client-supplied prices, rates, or monthly amounts.
2. **Authoritative Database Lookup**: Product selling price, plan tenure, interest rates, processing fees, and cashback amounts are loaded directly from PostgreSQL.
3. **Decimal Precision**: All intermediate and final calculations utilize high-precision Decimal arithmetic (via `Prisma.Decimal` / `Decimal.js`), preventing JavaScript floating-point rounding errors.
4. **Immutable Contract Snapshots**: When an application is created, a full snapshot of the commercial terms (`principalAmount`, `interestRateSnapshot`, `tenureMonthsSnapshot`, `monthlyAmountSnapshot`, `cashbackSnapshot`, `totalPayableSnapshot`) is stored in the `EMIApplication` table.

---

## 2. Mathematical Formulas & Calculation Models

### 2.1 Principal Amount Financed (\(P\))
The net principal financed is derived from the product variant's authoritative selling price minus any promotional instant cashback discount:
\[
P = \max(0, \text{variant.price} - \text{emiPlan.cashbackAmount})
\]

---

### 2.2 Standard Interest-Bearing EMI (Reducing Balance)
When `isZeroCost = false` and `interestRate > 0`:

- **Annual Interest Rate**: \(R = \text{interestRate}\) (expressed as percentage, e.g. `14.50`).
- **Monthly Interest Rate**: \(r = \frac{R}{12 \times 100}\).
- **Tenure in Months**: \(n = \text{tenureMonths}\).

The monthly installment (\(E\)) is computed using the standard reducing-balance formula:
\[
E = P \times \frac{r \times (1 + r)^n}{(1 + r)^n - 1}
\]

---

### 2.3 Zero-Cost / Zero-Interest EMI
When `isZeroCost = true` or `interestRate = 0`:

The effective interest rate is \(0.00\%\). The monthly installment is simply the principal divided by the tenure:
\[
E = \frac{P}{n}
\]

---

### 2.4 Total Payable Amount & Fees
The total amount payable by the customer over the loan term includes all monthly installments plus the one-time loan origination processing fee:
\[
\text{Total Payable} = (E \times n) + \text{emiPlan.processingFee}
\]

---

### 2.5 Total Interest Charged
The total interest paid by the customer over the tenure is:
\[
\text{Total Interest} = (E \times n) - P
\]

---

## 3. Decimal Precision & Rounding Rules

- **Arithmetic Precision**: All operations execute using 20 decimal places of intermediate precision.
- **Rounding Boundary**: Half-Up Rounding (`Decimal.ROUND_HALF_UP`) is applied only at the final boundary to format values to **2 decimal places** (e.g. `₹5495.83`).
- **No Floating-Point Operations**: Standard JavaScript `Number` operations (`+`, `-`, `*`, `/`) are strictly prohibited in financial calculation modules.

---

## 4. Relationship & Availability Validation Rules

Before generating an EMI breakdown or persisting an application, the backend enforces:
1. **Linkage Check**: `emiPlan.variantId === variantId`. If false, rejects with `400 Bad Request` (`INVALID_EMI_PLAN`).
2. **Product Availability**: `product.isPublished === true`.
3. **Variant Availability**: `variant.isActive === true` and `stockQuantity > 0`.
4. **Plan Availability**: `emiPlan.isActive === true`.
5. **Provider Availability**: `emiProvider.isActive === true`.

---

## 5. Application Snapshot & Immutability Guarantee

When `POST /api/v1/applications` is invoked:
1. The backend validates request & verifies active records.
2. The pure financial engine computes the authoritative breakdown.
3. A Prisma transaction (`prisma.$transaction`) creates an `EMIApplication` record with:
   - `applicationNumber` (e.g. `1FI-2026-984321`)
   - Customer info (`customerName`, `customerEmail`, `customerPhone`, `panNumberDemo`)
   - `status = PENDING`
   - Snapshot fields (`productNameSnapshot`, `variantSnapshot`, `providerNameSnapshot`, `skuSnapshot`, `principalAmount`, `interestRateSnapshot`, `tenureMonthsSnapshot`, `monthlyAmountSnapshot`, `cashbackSnapshot`, `totalPayableSnapshot`).

Even if the underlying catalog price or interest rate changes later, the stored application snapshot remains completely untouched and immutable.
