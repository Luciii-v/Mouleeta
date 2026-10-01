# Mouleeta V.2 - Project Memory

## Tech Stack
- **Framework:** Next.js (App Router, SSG focused)
- **Styling:** Tailwind CSS, Framer Motion
- **Backend/DB:** Firebase (Firestore, Firebase Admin SDK) + Shopify Storefront API
- **State/Auth:** Zustand, NextAuth

## Core Architecture
- **E-commerce:** Headless Shopify via `src/lib/shopify.ts`.
- **SSG Priority:** Strict SSG rendering for layouts and collections (`cache: 'force-cache'`). Dynamic rendering is restricted strictly to specific paths.
- **Analytics & Tracking:** Meta Pixel (`FacebookPixel.tsx`) gated tightly behind custom cookie consent (`CookieConsentToast.tsx`).

## Recent Key Decisions & Implementations
1. **Checkout CAPI & Pixels:** Unified Pixel ID (`2674451079639440`) and gated script loading until `mouleeta-cookie-consent === 'all'`.
2. **Review System:** Custom Firestore-based review system. Auto-publishing was disabled; reviews default to `status: 'pending'` and are filtered in-memory to bypass composite index constraints (`api/reviews/route.ts`).
3. **Robust Error Handling:** 
   - `global-error.tsx` for layout-level catastrophic crashes.
   - `notFound()` implementation for `collections/` and `products/` routes.
   - Inline checkout error UI in `CartDrawer.tsx` (no browser alerts).
   - Global offline network detection (`NetworkStatus.tsx`).
4. **Build Strictness:** Zero-tolerance policy for ESLint errors and Next.js dynamic render warnings. All pushes must pass `npm run lint` and `npm run build` cleanly.
5. **Aesthetic/Brand:** "Quiet Luxury" minimal aesthetic. Colors feature deep onyx `#1A1A1A` and warm beige/creams `#FAF9F6`, `#FDFBF7`. Emojis are strongly avoided.

## Pending / Future Work
- Hotjar Implementation (User put on hold).
- Meta CAPI & Ads Tracking Review (Pending checkout backend logic).
- Future SEO or additional CMS/admin integrations.
