# Mouleeta V.2 - Project Memory

## Tech Stack
- **Framework:** Next.js (App Router, SSG focused)
- **Styling:** Tailwind CSS, Framer Motion
- **Backend/DB:** Firebase (Firestore, Firebase Admin SDK) + Shopify Storefront API
- **State/Auth:** Zustand, NextAuth

## Core Architecture & Guidelines
- **E-commerce:** Headless Shopify via `src/lib/shopify.ts`.
- **SSG Priority:** Strict SSG rendering for layouts and collections (`cache: 'force-cache'`). Dynamic rendering is restricted strictly to specific paths.
- **Build Strictness:** Zero-tolerance policy for ESLint errors (`no-explicit-any`, etc.) and Next.js dynamic render warnings. All pushes MUST pass `npm run lint` and `npm run build` cleanly before deploying to Vercel.
- **Aesthetic/Brand:** "Quiet Luxury" minimal aesthetic. Colors feature deep onyx `#1A1A1A` and warm beige/creams `#FAF9F6`, `#FDFBF7`. Emojis are strongly avoided.

## Built & Achieved Today (Oct 2, 2026 Session)
1. **Instagram & Social Polish:**
   - Optimized Instagram bio for "Quiet Luxury" (MOULEETA, removed emojis).
   - Generated AI-driven texture-focused Highlight covers (fabric, packaging, envelope, wooden hanger) stored locally for the user.
2. **Review System Moderation:** 
   - Disabled auto-publishing. Reviews now default to `status: 'pending'`.
   - Filtered API GET requests for `approved` reviews *in-memory* to successfully bypass Firestore composite index constraints/crashes (`api/reviews/route.ts`).
3. **Layout Static Generation (SSG) Fix:** 
   - Changed Shopify upsell fetches in `lib/shopify.ts` from `no-store` to `force-cache`. This eliminated noisy build-time warnings and allowed the entire root layout to statically generate, significantly improving performance.
4. **Cookie Consent & Meta Pixel Gating:** 
   - Split Cookie Consent into distinct `all` and `essential` states.
   - Gated the Meta Pixel completely behind `mouleeta-cookie-consent === 'all'`. 
   - Embedded `fbq('track', 'PageView')` directly inside the script injection and used `useRef` to guarantee the PageView fires exactly once immediately upon consent without duplicating on SPA route changes.
5. **Comprehensive Error Handling Suite:** 
   - Created `global-error.tsx` for layout-level catastrophic crashes.
   - Replaced generic UI with true `notFound()` 404s for missing products/collections.
   - Replaced browser `alert()` with a clean, inline red error UI for checkout failures in `CartDrawer.tsx`.
   - Implemented a global `NetworkStatus.tsx` (`z-[9999]`) that drops down a "You are offline" banner and blocks checkout gracefully, preserving the cart.

## Active State
- The frontend is fully optimized, rigorously tested, and successfully deployed to Vercel. 
- E-commerce tracking is strictly and legally gated by cookie consent.
- The build pipeline is perfectly green (0 lint errors, 0 build warnings).
- The "Quiet Luxury" aesthetic is fully unified across the web app and social channels.

## Exact Next Steps (Start Here)
1. **Implement Hotjar:** The user previously put this on the backlog. Introduce session recording/heatmaps, ensuring it is *also* gated behind the cookie consent mechanism we built today.
2. **Meta Conversions API (CAPI):** The client-side Pixel is complete. The next priority is verifying or implementing server-side tracking (CAPI) for deeper conversion matching, especially around Add-To-Cart and Checkout.
3. **Admin Dashboard / Firestore Management:** Since reviews are now `pending` by default, an admin interface or script is needed to easily approve reviews in Firestore.

## Local Security Follow-up (Oct 4, 2026)
- Local changes are uncommitted and have not been deployed. Read `SECURITY.md` before deploying or changing authentication/dependencies.
- OTPs and API rate limits now use Firebase Admin Firestore transactions, HMAC-hashed identifiers/codes, explicit expiry, and deployment/purpose isolation. The shared store has no process-local fallback.
- Configure TTL on `expiresAt` for `securityOtpChallenges` and `securityRateLimits`, deny all browser access to those collections, and validate IAM/transactions in staging. `SECURITY_STATE_SECRET` falls back to `NEXTAUTH_SECRET`; both require at least 32 characters. Use an explicit isolated namespace in local/staging production-mode runs.
- Pre-remediation sessions are rejected using `securityVersion: 2`; users must reauthenticate after deployment.
- Product HTML is sanitized on the server with maintained `sanitize-html`; the search drawer uses `/api/search/catalog` so server modules stay out of client bundles.
- CSP now denies inline event attributes, but script-src still permits unsafe-inline for SSG hydration. A strict nonce/hash policy remains an explicit rendering/browser-testing decision, not a completed protection.
- Target Node 22.x (>=22.12) for `sanitize-html@2.18.0`. Retain/document the gRPC override; the ineffective braces override was removed.
- Verified: 17 synthetic security regression tests, clean lint/build/diff checks, and zero production audit findings. The full audit still reports five high-severity development-package entries from the braces lint-tooling advisory.
- External next steps: shared-state TTL/rules/runtime configuration, staging integration tests, Shopify credential rotation, canonical OAuth URL alignment, then deployment.
