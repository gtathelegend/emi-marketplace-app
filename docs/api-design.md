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
    "timestamp": "2026-09-02T22:30:00.000Z",
    "pagination": {
      "page": 1,
      "limit": 12,
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
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with slug 'non-existent-slug' not found",
    "details": []
  },
  "meta": {
    "requestId": "req_c7b89d123e4a",
    "timestamp": "2026-09-02T22:30:00.000Z"
  }
}
```

---

## 2. Implemented Public Catalog API Endpoints (Phase 3)

### 2.1 Get Products Catalog List
- **HTTP Method**: `GET`
- **Path**: `/api/v1/products`
- **Purpose**: Retrieves paginated list of public, published products with default variant pricing & primary thumbnail.
- **Query Parameters**:
  - `page` (optional, int, default `1`, min `1`): Page number.
  - `limit` (optional, int, default `12`, min `1`, max `50`): Results per page.
  - `search` (optional, string, max length 100): Case-insensitive search across title, subtitle, description, and brand name.
  - `brand` (optional, string): Filter by brand slug or name.
  - `category` (optional, string): Filter by category slug or name.
  - `sort` (optional, enum, default `newest`): Allow-listed sorting choices (`newest`, `price_asc`, `price_desc`, `name_asc`, `name_desc`).
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "c1f7b89d-...",
      "title": "Apple iPhone 15 Pro",
      "slug": "apple-iphone-15-pro",
      "subtitle": "Forged in titanium. Powered by A17 Pro.",
      "description": "iPhone 15 Pro features a Grade 5 titanium design...",
      "basePrice": 134900.00,
      "rating": 4.8,
      "reviewCount": 142,
      "createdAt": "2026-09-02T22:30:00.000Z",
      "brand": {
        "id": "b1...",
        "name": "Apple",
        "slug": "apple",
        "logoUrl": "..."
      },
      "category": {
        "id": "c1...",
        "name": "Smartphones",
        "slug": "smartphones"
      },
      "primaryImage": "https://images.unsplash.com/...",
      "defaultVariant": {
        "id": "v1...",
        "sku": "IP15P-128-NAT",
        "title": "iPhone 15 Pro (Natural Titanium, 128GB)",
        "colorName": "Natural Titanium",
        "colorHex": "#888783",
        "storage": "128GB",
        "price": 134900.00,
        "mrp": 144900.00,
        "stockQuantity": 15
      }
    }
  ],
  "meta": {
    "requestId": "req_xyz123",
    "timestamp": "2026-09-02T22:30:00.000Z",
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 4,
      "totalPages": 1
    }
  }
}
```

---

### 2.2 Get Product Details by Slug
- **HTTP Method**: `GET`
- **Path**: `/api/v1/products/:slug`
- **Purpose**: Retrieves complete product detail for the Product Detail Page (PDP), including all active variants, gallery images, specifications, EMI plans, and partner EMI providers.
- **Path Parameters**:
  - `slug` (required, string): Lowercase hyphenated product slug (e.g. `apple-iphone-15-pro`).
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": "c1f7b89d-...",
    "title": "Apple iPhone 15 Pro",
    "slug": "apple-iphone-15-pro",
    "subtitle": "Forged in titanium. Powered by A17 Pro.",
    "description": "iPhone 15 Pro features a Grade 5 titanium design...",
    "basePrice": 134900.00,
    "rating": 4.8,
    "reviewCount": 142,
    "createdAt": "2026-09-02T22:30:00.000Z",
    "updatedAt": "2026-09-02T22:30:00.000Z",
    "brand": {
      "id": "b1...",
      "name": "Apple",
      "slug": "apple",
      "logoUrl": "..."
    },
    "category": {
      "id": "c1...",
      "name": "Smartphones",
      "slug": "smartphones",
      "description": "Flagship mobile devices..."
    },
    "variants": [
      {
        "id": "v1...",
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
          {
            "id": "img1...",
            "url": "https://images.unsplash.com/...",
            "altText": "Front View",
            "displayOrder": 1,
            "isPrimary": true
          }
        ],
        "specifications": [
          {
            "id": "spec1...",
            "groupName": "Display",
            "key": "Screen Size",
            "value": "6.1 inches Super Retina XDR OLED",
            "displayOrder": 1
          }
        ],
        "emiPlans": [
          {
            "id": "plan1...",
            "tenureMonths": 6,
            "interestRate": 0.00,
            "processingFee": 199.00,
            "cashbackAmount": 3000.00,
            "minDownPayment": 0.00,
            "isZeroCost": true,
            "provider": {
              "id": "prov1...",
              "name": "HDFC Bank",
              "code": "HDFC_BANK",
              "logoUrl": "https://assets.1fi.in/banks/hdfc.svg"
            }
          }
        ]
      }
    ]
  },
  "meta": {
    "requestId": "req_xyz456",
    "timestamp": "2026-09-02T22:30:00.000Z"
  }
}
```

---

## 3. Error Codes Matrix

| HTTP Status | Error Code | Trigger Condition |
|---|---|---|
| 400 Bad Request | `VALIDATION_ERROR` | Malformed page, limit > 50, invalid sort option, or invalid slug syntax |
| 404 Not Found | `PRODUCT_NOT_FOUND` | Product slug does not exist or product is unpublished |
| 404 Not Found | `ROUTE_NOT_FOUND` | Accessing undefined API endpoint |
| 429 Too Many Requests | `RATE_LIMIT_EXCEEDED` | Request limit exceeded (100 req/15 mins per IP) |
| 500 Internal Server Error | `INTERNAL_SERVER_ERROR` | Unhandled error |
