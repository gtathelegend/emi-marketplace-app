# ADR 005: TanStack Query for Server State & React Router URL Sync for Local State

## Context
Web applications frequently struggle with state management when attempting to store server-fetched data (products, variants, EMI plans) in global client state stores like Redux or Zustand. This leads to manual cache invalidation code, loading indicator state boilerplate, and out-of-sync UI states. Simultaneously, user selections (such as selected color variant or chosen EMI tenure) must be shareable via URLs.

## Decision
1. **Server State via TanStack Query (React Query v5)**: Use TanStack Query for fetching, caching, deduplicating, and background revalidating server data.
2. **URL Search Params for Selection State**: Synchronize active variant selection and selected EMI plan in URL query params (`/product/iphone-15-pro?variant=v_101&emi=p_301`) via React Router `useSearchParams()`.
3. **Zero Global Redux Store**: Avoid global state managers for server data.

## Alternatives Considered
1. **Redux Toolkit / Zustand Global Store**:
   - *Pros*: Centralized global state object.
   - *Cons*: Enormous boilerplate for `loading`, `error`, `data` states; high risk of stale cache when navigating between products.
2. **Component `useState` Only**:
   - *Pros*: Simple local component state.
   - *Cons*: Selection loses persistence on page refresh; deep links to specific variants cannot be shared with friends or saved as bookmarks.

## Reasoning
- **Declarative Server State**: TanStack Query handles caching, retry logic, background refetching, and error boundaries automatically.
- **Deep-Linkable UX**: Storing `variant` and `emi` IDs in URL search parameters allows users to bookmark or share exact product configurations.
- **Simplicity**: Keeps client state minimal and local.

## Trade-offs
- Developers must understand TanStack Query query key management (`['product', slug]`, `['emi-plans', variantId]`).
