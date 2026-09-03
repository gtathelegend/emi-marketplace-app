# UX & Frontend Decisions — EMI App

## 1. Customer Experience & Information Hierarchy

The **EMI App** frontend provides a transparent, zero-trust financing experience for Indian retail electronics consumers.

### Key Journey Stages:
1. **Catalog Page (`/products`)**:
   - Hero value proposition highlighting 100% server-verified financing options.
   - Real-time search bar (debounced), brand & category filters, allow-listed sorting, and backend pagination.
   - Visual presentation using `ProductCard` displaying primary product thumbnail, MRP strike-through, selling price, and starting monthly EMI badge (`Starting ₹2,198/mo`).
2. **Product Detail Page (`/products/:slug`)**:
   - Breadcrumb navigation and sticky primary image gallery switcher.
   - Dynamic variant selection (color swatches and storage pills). Selecting a variant automatically updates the displayed price, MRP, gallery images, specifications, and available bank `EMIPlan` cards.
   - Bank EMI plan cards (`EmiPlanCard`) highlighting provider logo, tenure duration, monthly payment, interest rate, zero-cost badge, and promotional cashback.
   - Authoritative financing breakdown summary card displaying net principal financed, instant cashback discount, processing fee, and monthly installment.
3. **Application Checkout Modal**:
   - Small, non-intrusive demo form (`fullName`, `email`, `phone`).
   - Inline Zod validation (valid name, email regex, 10-digit Indian phone regex).
   - Zero real sensitive data collected (no real PAN, Aadhaar, CVV, or card passwords).
   - Duplicate submission protection and loading spinner.
4. **Application Tracking Page (`/applications/:applicationNumber`)**:
   - Status badge (`PENDING`, `APPROVED`, etc.).
   - Displays stored immutable contract snapshot (`productNameSnapshot`, `variantSnapshot`, `providerNameSnapshot`, `skuSnapshot`, `principalAmount`, `interestRateSnapshot`, `tenureMonthsSnapshot`, `monthlyAmountSnapshot`, `cashbackSnapshot`, `totalPayableSnapshot`).

---

## 2. Zero-Trust Frontend Financial Authority

- **No Frontend EMI Math**: The frontend never derives or recalculates EMI formulas.
- **Server Authority**: All prices, MRPs, interest rates, processing fees, cashbacks, and contract snapshots are fetched directly from backend API endpoints (`GET /api/v1/products`, `GET /api/v1/products/:slug`, `GET /api/v1/applications/:applicationNumber`).
- **Tampering Security**: Submitting an application transmits **ONLY** `variantId`, `emiPlanId`, and `customer` contact details. The backend independently calculates and records the contract snapshot.

---

## 3. Responsive & Accessibility Standards

- **Mobile Viewports (`320px` - `414px`)**: Single-column stacked product grids, full-width action buttons, touch targets \(\ge 44\text{px}\), and bottom-sheet application modal styling.
- **Desktop Viewports (`1024px` - `1440px`)**: 4 to 5 column product grid, persistent sticky navigation header, side-by-side gallery and product information layout.
- **Keyboard & Focus**: All controls use semantic HTML `<button>`, `<a>`, `<input>` elements with visible focus rings (`focus-visible:ring-2 focus-visible:ring-emerald-500`).
