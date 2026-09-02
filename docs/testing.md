# Testing Strategy & Edge Cases — 1Fi Marketplace

## 1. Testing Philosophy & Test Pyramid

The testing suite for **1Fi Marketplace** prioritizes behavioral verification and domain correctness over arbitrary code line coverage. Special emphasis is placed on validating financial calculations, security barriers, failure edge cases, and user workflow continuity.

```
       / \
      /   \     E2E / Frontend Integration Tests (React Testing Library)
     /     \    --> Product page, variant switching, checkout flow
    /-------\
   /         \   API Integration Tests (Supertest + Vitest)
  /           \  --> Endpoint response structure, auth protection, database transactions
 /-------------\
/               \ Unit Tests (Vitest)
───────────────── --> EMI math formulas, Zod schema validation, data mappers
```

---

## 2. Backend Test Suite Matrix (Vitest + Supertest)

### 2.1 Domain & Financial Math Unit Tests (`backend/src/services/__tests__/emi.service.test.ts`)
- **Zero-Cost EMI Calculation**: Verifies that when `interestRate = 0`, monthly installment equals `(price - cashback) / tenureMonths` and `totalInterest = 0`.
- **Standard Interest EMI Calculation**: Verifies standard reducing-balance EMI formula outputs against pre-computed financial reference tables.
- **Cashback & Processing Fee Handling**: Ensures cashback subtracts from principal financed while processing fee adds to total cost payable.

### 2.2 API Endpoint Integration Tests (`backend/src/tests/api/`)

| Test Suite | Scenario | Inputs / Trigger | Expected Outcome |
|---|---|---|---|
| **Catalog API** | Get Products List | `GET /api/v1/products` | `200 OK`, returns array of products with category/brand data & primary image |
| **Catalog API** | Get Product by Valid Slug | `GET /api/v1/products/apple-iphone-15-pro` | `200 OK`, returns product with variants, specs, and default variant |
| **Catalog API** | Get Product by Invalid Slug | `GET /api/v1/products/non-existent-slug` | `404 Not Found`, code: `PRODUCT_NOT_FOUND` |
| **EMI API** | Get EMI Plans for Variant | `GET /api/v1/variants/:id/emi-plans` | `200 OK`, returns active EMI plans for variant |
| **Checkout API**| Create Application - Valid | `POST /api/v1/emi-applications` with valid `variantId`, `emiPlanId`, & customer info | `201 Created`, returns `applicationNumber` and server-calculated financial breakdown |
| **Checkout API**| Create Application - Invalid Variant | `POST /api/v1/emi-applications` with non-existent `variantId` | `404 Not Found`, code: `VARIANT_NOT_FOUND` |
| **Checkout API**| Create Application - Invalid EMI Plan | `POST /api/v1/emi-applications` with non-existent `emiPlanId` | `400 Bad Request`, code: `INVALID_EMI_PLAN` |
| **Checkout API**| Variant / EMI Plan Mismatch | `POST /api/v1/emi-applications` with `emiPlanId` belonging to Variant B submitted for Variant A | `400 Bad Request`, code: `INVALID_EMI_PLAN` ("Plan does not belong to selected variant") |
| **Checkout API**| Inactive EMI Plan | `POST /api/v1/emi-applications` with `emiPlanId` where `isActive = false` | `400 Bad Request`, code: `INVALID_EMI_PLAN` ("Plan is currently inactive") |
| **Checkout API**| Invalid Customer PAN / Phone | `POST /api/v1/emi-applications` with invalid PAN string `12345` | `400 Bad Request`, code: `VALIDATION_ERROR` with Zod field breakdown |
| **Admin Auth** | Login - Invalid Credentials | `POST /api/v1/admin/auth/login` with wrong password | `401 Unauthorized`, code: `UNAUTHORIZED` |
| **Admin API** | Create Product without Token | `POST /api/v1/admin/products` without `Authorization` header | `401 Unauthorized`, code: `UNAUTHORIZED` |

---

## 3. Frontend Test Suite Matrix (React Testing Library + Vitest)

| Component / Page | Test Scenario | Behavior Tested |
|---|---|---|
| `ProductDetailPage` | Product Information Rendering | Renders title, rating, review count, base price, description, and specs correctly |
| `VariantSelector` | Variant Switching | Clicking a color/storage button updates selected variant state and URL query params |
| `EMIPlanSelector` | EMI Plan Selection | Selecting an EMI tenure updates the instant monthly breakdown card and interest details |
| `ProductDetailPage` | Loading State | Displays skeleton loader elements while TanStack Query is fetching product data |
| `ProductDetailPage` | Error State | Displays fallback error banner with retry button if product request fails (`404` or `500`) |
| `CheckoutModal` | Form Validation & Submission | Prevents submission with invalid inputs; submits valid customer data to API and displays confirmation step |
| `ConfirmationCard` | Application Summary | Displays generated tracking application number, customer details, and EMI schedule |

---

## 4. Test Execution Commands

```bash
# Run backend unit and API integration tests
cd backend
npm run test

# Run backend tests with coverage report
npm run test:coverage

# Run frontend component & flow tests
cd frontend
npm run test
```
