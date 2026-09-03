# EMI App — Design System & Visual Foundation

## 1. Executive Summary & Brand Direction

**EMI App** is an authoritative, server-driven financial e-commerce platform. Its visual design system is built to communicate:
- **Trust & Security**: High-contrast, clean typography and clear server-verified financial tags.
- **Affordability & Clarity**: EMI monthly badges (`Starting ₹2,198/mo`) highlighted with high-contrast promotional accents.
- **Modern Indian Fintech Aesthetic**: Crisp slate backgrounds, emerald brand accents (`#059669` / `#047857`), and restrained elevation.

---

## 2. Design Tokens

### 2.1 Color Palette
- **Brand Primary (Emerald)**:
  - `brand-50`: `#ecfdf5` (Subtle container backgrounds)
  - `brand-100`: `#d1fae5` (Badge backgrounds)
  - `brand-600`: `#059669` (Primary buttons, key CTAs)
  - `brand-700`: `#047857` (Hover states, text highlights)
  - `brand-900`: `#064e3b` (Deep text accents)
- **Navy Accent**:
  - `navy-900`: `#0f172a` (Hero headers, dark mode containers)
  - `navy-800`: `#1e293b` (Secondary button backgrounds)
- **Neutrals (Slate)**:
  - `slate-50`: `#f8fafc` (Body background)
  - `slate-100`: `#f1f5f9` (Card borders & pill backgrounds)
  - `slate-300`: `#cbd5e1` (Input borders)
  - `slate-900`: `#0f172a` (Primary text color)

---

### 2.2 Typography Scale
- **Font Family**: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif.
- **Display**: `3xl` to `5xl`, `font-extrabold`, `tracking-tight`.
- **Heading 1**: `2xl` to `3xl`, `font-bold`.
- **Heading 2**: `xl` to `2xl`, `font-semibold`.
- **Body**: `base` (`16px`), `font-normal`, `leading-relaxed`.
- **Caption**: `xs` (`12px`), `font-medium`, `text-slate-500`.
- **Price Display**: `font-bold text-slate-900 tracking-tight`.
- **EMI Highlight**: `font-extrabold text-emerald-700 bg-gradient-to-r from-emerald-50 to-teal-50`.

---

### 2.3 Radius & Elevation Scale
- **Radius**: `xl` (`0.75rem` / `12px`), `2xl` (`1.0rem` / `16px`).
- **Shadows**:
  - `shadow-card`: `0 1px 3px 0 rgba(0, 0, 0, 0.05)`
  - `shadow-card-hover`: `0 10px 25px -5px rgba(0, 0, 0, 0.08)`
  - `shadow-modal`: `0 20px 25px -5px rgba(0, 0, 0, 0.1)`

---

## 3. Component Inventory

### 3.1 Layout Primitives
- `Container`: Max-width wrapper (`sm`, `md`, `lg`, `xl`, `full`) with responsive horizontal padding.
- `Stack`: Flexbox column/row primitive with configurable `gap`, `align`, and `justify`.
- `Section`: Semantic `<section>` container with responsive title, subtitle, and action slots.
- `ResponsiveGrid`: Grid primitive adapting columns dynamically across mobile (`1-2`), tablet (`2-3`), and desktop (`3-5`).

### 3.2 Core UI Primitives
- `Button`: Primary, secondary, outline, ghost, destructive variants. Supports loading spinner, disabled states, and size scales.
- `Input`: Accessible input with floating label, hint text, error callouts, and left/right icons.
- `SegmentedSelector`: Interactive option selector pills for color, storage, and EMI tenure selection.
- `Card`: Container primitive supporting `default`, `elevated`, `interactive`, and `bordered` variants.
- `Badge`: Status badges (`success`, `warning`, `info`, `neutral`, `promotional`).
- `Alert`: Accessible callout box with variants (`success`, `warning`, `error`, `info`) and icons.
- `Skeleton`: Animated loading placeholder primitives (`SkeletonText`, `SkeletonCard`, `SkeletonImage`).
- `Spinner`: SVG loading spinner.
- `Modal`: Accessible portal dialog with backdrop click, `Escape` key handler, body scroll lock, and mobile sheet styling.
- `EmptyState`: Empty search/list state component.
- `ErrorState`: Failure callout view with retry callback.

### 3.3 Commerce Presentation Primitives
- `PriceDisplay`: Formats INR prices (`₹1,34,900`), calculates strike-through MRP & discount percentage.
- `EmiHighlight`: EMI monthly callout badge (`Starting ₹2,198/mo`).
- `ProductImage`: Aspect-ratio image container with fallback handling and loading animation.
- `ProductCard`: Presentation card primitive for catalog items. Purely presentation-driven.
- `VariantSelector`: Presentation selector for color and storage options.
- `EmiPlanCard`: Presentation card for EMI financing plans (provider logo, tenure, monthly installment, interest rate, cashback badge, zero-cost indicator, selection ring).

---

## 4. Responsive & Accessibility Standards

- **Mobile First**: Minimum supported width is 320px. Touch targets are at least `44px x 44px`.
- **Keyboard Navigation**: All interactive elements use semantic `<button>`, `<a>`, or `<input>` tags with explicit `focus-visible` ring styling (`ring-2 ring-emerald-500 ring-offset-2`).
- **Data Boundaries**: Zero hardcoded business or catalog data inside low-level primitives.
