# REST API Specification — FinEmi Marketplace

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
  "data": [ ... ],
  "meta": {
    "requestId": "req_c7b89d123e4a",
    "timestamp": "2026-09-02T22:30:00.000Z"
  }
}
```

#### Error Response Envelope
```json
{
  "success": false,
  "error": {
    "code": "INVALID_EMI_PLAN",
    "message": "Selected EMI plan does not belong to the requested product variant",
    "details": []
  },
  "meta": {
    "requestId": "req_c7b89d123e4a",
    "timestamp": "2026-09-02T22:30:00.000Z"
  }
}
```

---

## 2. Implemented Public API Endpoints (Phases 3 & 4)

### 2.1 Get Products Catalog List
- **HTTP Method**: `GET`
- **Path**: `/api/v1/products`
- **Purpose**: Retrieves paginated list of public, published products with default variant pricing & primary thumbnail.

---

### 2.2 Get Product Details by Slug
- **HTTP Method**: `GET`
- **Path**: `/api/v1/products/:slug`
- **Purpose**: Retrieves complete product detail for the Product Detail Page (PDP), including active variants, gallery images, specifications, EMI plans, and partner EMI providers.

---

### 2.3 Submit EMI Application (Phase 4)
- **HTTP Method**: `POST`
- **Path**: `/api/v1/applications`
- **Purpose**: Submits a customer EMI financing application. The server independently calculates reducing-balance/zero-cost EMI terms, verifies relationship constraints, and transactionally persists an immutable commercial contract snapshot.
- **Request Body**:
```json
{
  "variantId": "v1_iphone",
  "emiPlanId": "plan_hdfc_6m",
  "customer": {
    "fullName": "Rahul Verma",
    "email": "rahul.verma@example.com",
    "phone": "9876543210"
  }
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "data": {
    "id": "app_c7b89d123e4a",
    "applicationNumber": "1FI-2026-984321",
    "status": "PENDING",
    "appliedAt": "2026-09-02T22:30:00.000Z",
    "customer": {
      "fullName": "Rahul Verma",
      "email": "rahul.verma@example.com",
      "phone": "9876543210"
    },
    "contractSnapshot": {
      "productName": "Apple iPhone 15 Pro",
      "variantName": "iPhone 15 Pro (Natural Titanium, 128GB)",
      "providerName": "HDFC Bank",
      "sku": "IP15P-128-NAT",
      "principalAmount": 131900.00,
      "interestRate": 0.00,
      "tenureMonths": 6,
      "monthlyAmount": 21983.33,
      "cashbackAmount": 3000.00,
      "totalPayable": 132098.98
    }
  },
  "meta": {
    "requestId": "req_xyz987",
    "timestamp": "2026-09-02T22:30:00.000Z"
  }
}
```

---

### 2.4 Get Application Snapshot by Reference (Phase 4)
- **HTTP Method**: `GET`
- **Path**: `/api/v1/applications/:applicationNumber`
- **Purpose**: Retrieves stored historical snapshot for customer status tracking.
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": "app_c7b89d123e4a",
    "applicationNumber": "1FI-2026-984321",
    "status": "PENDING",
    "appliedAt": "2026-09-02T22:30:00.000Z",
    "customer": {
      "fullName": "Rahul Verma",
      "email": "rahul.verma@example.com",
      "phone": "9876543210"
    },
    "contractSnapshot": {
      "productName": "Apple iPhone 15 Pro",
      "variantName": "iPhone 15 Pro (Natural Titanium, 128GB)",
      "providerName": "HDFC Bank",
      "sku": "IP15P-128-NAT",
      "principalAmount": 131900.00,
      "interestRate": 0.00,
      "tenureMonths": 6,
      "monthlyAmount": 21983.33,
      "cashbackAmount": 3000.00,
      "totalPayable": 132098.98
    },
    "productReference": {
      "title": "Apple iPhone 15 Pro",
      "slug": "apple-iphone-15-pro"
    },
    "providerReference": {
      "name": "HDFC Bank",
      "code": "HDFC_BANK",
      "logoUrl": "https://assets.1fi.in/banks/hdfc.svg"
    }
  },
  "meta": {
    "requestId": "req_xyz654",
    "timestamp": "2026-09-02T22:30:00.000Z"
  }
}
```

---

## 3. Error Codes Matrix

| HTTP Status | Error Code | Trigger Condition |
|---|---|---|
| 400 Bad Request | `VALIDATION_ERROR` | Malformed page, limit > 50, invalid sort option, or invalid customer phone/email |
| 400 Bad Request | `INVALID_EMI_PLAN` | EMI plan does not belong to selected variant, or plan/provider is inactive |
| 404 Not Found | `PRODUCT_NOT_FOUND` | Product slug does not exist or product is unpublished |
| 404 Not Found | `VARIANT_UNAVAILABLE` | Product variant does not exist or is inactive |
| 404 Not Found | `APPLICATION_NOT_FOUND` | Application reference number does not exist |
| 429 Too Many Requests | `RATE_LIMIT_EXCEEDED` | Request limit exceeded (100 req/15 mins per IP) |
| 500 Internal Server Error | `INTERNAL_SERVER_ERROR` | Unhandled error |
