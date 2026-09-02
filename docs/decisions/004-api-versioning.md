# ADR 004: Explicit REST API Versioning & Response Enveloping

## Context
As frontend and mobile clients consume backend APIs, API contracts evolve. Unversioned endpoints (`/api/products`) can cause breaking changes for clients when response formats change. Furthermore, inconsistent API error structures complicate client-side error handling.

## Decision
1. **URI Path Versioning**: Prefix all application APIs with `/api/v1/` (e.g., `/api/v1/products`, `/api/v1/emi-applications`).
2. **Standardized Response Envelope**: All endpoints return a predictable JSON envelope:
   - Success: `{ "success": true, "data": { ... }, "meta": { "requestId", "timestamp", "pagination"? } }`
   - Error: `{ "success": false, "error": { "code": "DOM_CODE", "message": "...", "details"?: [] }, "meta": { "requestId", "timestamp" } }`

## Alternatives Considered
1. **Unversioned URLs (`/api/products`)**:
   - *Pros*: Marginally shorter URLs.
   - *Cons*: High risk of breaking existing clients during feature updates or API refactoring.
2. **Header-Based Versioning (`Accept-Version: v1`)**:
   - *Pros*: Clean URLs.
   - *Cons*: Harder to test in browsers, postman, and curl; less explicit in router code.

## Reasoning
- **Explicit Contract**: `/api/v1/` clearly indicates contract stability.
- **Uniform Error Handling**: Frontend Axios/Fetch interceptors can globally handle `error.code` without checking arbitrary payload shapes.
- **Traceability**: `requestId` in metadata allows correlating client errors with server log entries.

## Trade-offs
- Slightly longer URL paths.
