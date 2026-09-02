# ADR 003: Immutable Financial Contract Snapshots & Server-Side Calculation

## Context
In e-commerce and fintech marketplaces, product prices, interest rates, processing fees, and cashback promotions change frequently. If a customer submits an EMI application based on current rates, the application record must remain immutable even if the catalog price or interest rate is updated by an admin later. Furthermore, trusting the client frontend to calculate monthly installments or total interest invites client-side request tampering.

## Decision
1. **Zero-Trust Client Submissions**: The frontend submits **ONLY** identifiers (`variantId`, `emiPlanId`) and applicant personal details.
2. **Authoritative Server Math**: The backend queries the authoritative price from `ProductVariant` and rates from `EMIPlan` inside a database transaction, and executes standard reducing-balance EMI formulas on the server.
3. **Immutable Contract Snapshots**: `EMIApplication` stores frozen snapshot columns: `principalAmount`, `tenureMonths`, `interestRate`, `monthlyInstallment`, `totalInterest`, `totalAmountPayable`, `cashbackAmount`, and `processingFee`.

## Alternatives Considered
1. **Client-Calculated Submissions**:
   - *Pros*: Reduces server CPU workload slightly.
   - *Cons*: Major security vulnerability allowing users to edit HTTP request payloads via browser developer tools and apply for zero-interest or single-rupee loans.
2. **Dynamic Foreign Key Calculations**:
   - *Pros*: Saves database storage by re-calculating figures on the fly via `variant.price` and `emiPlan.interestRate`.
   - *Cons*: Catastrophic data corruption if an admin edits a product's price or changes an EMI plan's interest rate next month, altering existing loan agreements retroactively.

## Reasoning
- **Financial Security**: Completely eliminates client tampering.
- **Contractual Integrity**: Preserves exact legally binding loan terms agreed upon at application time.
- **Compliance & Auditability**: Historical application records match exact disbursemens regardless of catalog edits.

## Trade-offs
- Duplicates numeric pricing data in `EMIApplication` table columns, which is intentionally required for immutable snapshotting.
