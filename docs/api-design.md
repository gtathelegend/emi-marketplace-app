# REST API Specification — 1Fi Marketplace

## 1. API Design Conventions

### Base URL
- Production Base URL: `https://api.marketplace.1fi.in/api/v1`
- Development Base URL: `http://localhost:5000/api/v1`

### Standard Response Envelope
All API responses follow a uniform JSON structure:

#### Success Response Envelope
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "req_c7b89d123e4a",
    "timestamp": "2026-09-02T21:30:00.000Z",
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 4,
      "totalPages": 1
    }
  }
}
```

#### Error Response Envelope
```json
{
  "success": false,
  "error": {
    "code": "INVALID_EMI_PLAN",
    "message": "The selected EMI plan is not available or inactive for this product variant.",
    "details": [
      {
        "field": "emiPlanId",
        "issue": "Plan plan_999 is inactive."
      }
    ]
  },
  "meta": {
    "requestId": "req_c7b89d123e4a",
    "timestamp": "2026-09-02T21:30:00.000Z"
  }
}
```

### Domain Error Codes Matrix
| HTTP Status | Error Code | Description |
|---|---|---|
| 400 Bad Request | `VALIDATION_ERROR` | Request payload failed Zod schema validation |
| 400 Bad Request | `INVALID_EMI_PLAN` | Plan is inactive or does not belong to specified variant |
| 400 Bad Request | `OUT_OF_STOCK` | Requested variant has zero stock |
| 401 Unauthorized | `UNAUTHORIZED` | Missing, invalid, or expired JWT token |
| 403 Forbidden | `FORBIDDEN` | Admin user lacks role permissions |
| 404 Not Found | `PRODUCT_NOT_FOUND` | Product slug or ID does not exist |
| 404 Not Found | `VARIANT_NOT_FOUND` | Product variant ID does not exist |
| 404 Not Found | `APPLICATION_NOT_FOUND` | Application tracking number not found |
| 409 Conflict | `DUPLICATE_SKU` | Variant SKU already exists |
| 429 Too Many Requests | `RATE_LIMIT_EXCEEDED` | Request threshold exceeded |
| 500 Internal Server Error | `INTERNAL_SERVER_ERROR` | Unhandled error (details logged server-side only) |

---

## 2. Public Catalog & EMI API Endpoints

### 2.1 Get Products Catalog
- **Endpoint**: `GET /products`
- **Query Parameters**:
  - `category` (optional, string): Filter by category slug.
  - `brand` (optional, string): Filter by brand slug.
  - `search` (optional, string): Search in title/subtitle.
  - `page` (optional, int, default `1`).
  - `limit` (optional, int, default `12`).
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "prod_7a8b9c",
      "title": "Apple iPhone 15 Pro",
      "slug": "apple-iphone-15-pro",
      "subtitle": "Titanium. So strong. So light. So Pro.",
      "basePrice": 134900.00,
      "rating": 4.8,
      "reviewCount": 128,
      "brand": { "name": "Apple", "slug": "apple" },
      "category": { "name": "Smartphones", "slug": "smartphones" },
      "primaryImage": "https://assets.1fi.in/products/iphone15pro/nat-1.png",
      "minMonthlyEmi": 5620.83
    }
  ]
}
```

---

### 2.2 Get Product Details by Slug
- **Endpoint**: `GET /products/:slug`
- **Path Parameters**: `slug` (string, e.g., `apple-iphone-15-pro`).
- **Response `200 OK`**: Returns complete product entity with default variant, all variant choices, specifications, gallery, and linked EMI plans.
```json
{
  "success": true,
  "data": {
    "id": "prod_7a8b9c",
    "title": "Apple iPhone 15 Pro",
    "slug": "apple-iphone-15-pro",
    "description": "iPhone 15 Pro features a Grade 5 titanium design...",
    "brand": { "id": "b_1", "name": "Apple", "logoUrl": "..." },
    "category": { "id": "c_1", "name": "Smartphones" },
    "variants": [
      {
        "id": "var_101",
        "sku": "IP15P-128-NAT",
        "title": "iPhone 15 Pro (Natural Titanium, 128GB)",
        "colorName": "Natural Titanium",
        "colorHex": "#888783",
        "storage": "128GB",
        "price": 134900.00,
        "mrp": 144900.00,
        "stockQuantity": 15,
        "isDefault": true,
        "images": [
          { "url": "https://assets.1fi.in/iphone15-nat-1.png", "isPrimary": true }
        ]
      }
    ],
    "specifications": [
      { "groupName": "Display", "key": "Screen Size", "value": "6.1 inches" }
    ]
  }
}
```

---

### 2.3 Get EMI Plans for Variant
- **Endpoint**: `GET /variants/:variantId/emi-plans`
- **Path Parameters**: `variantId` (string).
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "plan_301",
      "variantId": "var_101",
      "bankName": "HDFC Bank",
      "tenureMonths": 24,
      "interestRate": 0.00,
      "processingFee": 199.00,
      "cashbackAmount": 3000.00,
      "minDownPayment": 0.00,
      "isZeroCost": true,
      "isActive": true,
      "calculatedBreakdown": {
        "variantPrice": 134900.00,
        "principalFinanced": 131900.00,
        "monthlyInstallment": 5495.83,
        "totalInterest": 0.00,
        "totalCost": 132099.00
      }
    }
  ]
}
```

---

### 2.4 Submit EMI Application
- **Endpoint**: `POST /emi-applications`
- **Request Body (Zod Validated)**:
```json
{
  "variantId": "var_101",
  "emiPlanId": "plan_301",
  "customerName": "Rohan Sharma",
  "customerEmail": "rohan.sharma@example.com",
  "customerPhone": "+919876543210",
  "panNumber": "ABCDE1234F"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "data": {
    "id": "app_901",
    "applicationNumber": "1FI-2026-883920",
    "status": "PENDING",
    "customerName": "Rohan Sharma",
    "customerEmail": "rohan.sharma@example.com",
    "variantTitle": "iPhone 15 Pro (Natural Titanium, 128GB)",
    "bankName": "HDFC Bank",
    "financialSummary": {
      "principalAmount": 131900.00,
      "tenureMonths": 24,
      "interestRate": 0.00,
      "monthlyInstallment": 5495.83,
      "totalInterest": 0.00,
      "processingFee": 199.00,
      "cashbackAmount": 3000.00,
      "totalAmountPayable": 132099.00
    },
    "appliedAt": "2026-09-02T21:30:00.000Z"
  }
}
```

---

### 2.5 Get Application Status by Application Number
- **Endpoint**: `GET /emi-applications/:applicationNumber`
- **Response `200 OK`**: Returns current application status and complete financial summary.

---

## 3. Protected Admin API Endpoints

Headers Required: `Authorization: Bearer <jwt_token>`

### 3.1 Admin Authentication
- `POST /admin/auth/login` (Body: `{ email, password }`) -> Returns JWT token & admin profile.
- `GET /admin/auth/me` -> Returns current authenticated admin profile.

### 3.2 Catalog & Inventory Management
- `POST /admin/products` -> Create new product & specifications.
- `PUT /admin/products/:id` -> Update product metadata.
- `POST /admin/variants` -> Add variant to product.
- `PUT /admin/variants/:id` -> Update price, stock, or color.

### 3.3 EMI Plan Management
- `POST /admin/emi-plans` -> Add new EMI plan to a variant.
- `PUT /admin/emi-plans/:id` -> Update interest rate, cashback, tenure, or toggle active status (`isActive`).

### 3.4 Application Processing
- `GET /admin/applications` -> Paginated list of submitted applications (filter by status).
- `PATCH /admin/applications/:id/status` -> Body: `{ status: "APPROVED" | "REJECTED" | "DISBURSED" }`.

### 3.5 System Audit Trail
- `GET /admin/audit-logs` -> Query administrative audit history with entity & user filtering.
