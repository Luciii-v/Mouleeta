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

## Local Security Follow-up & Deployment (Oct 15, 2026)
- Security overhaul successfully committed and pushed to `main`.
- CI pipeline in `.github/workflows/deploy.yml` upgraded to Node 22 (aligning with `package.json` engines and dependencies like `sanitize-html@2.18.0` and `google-logging-utils@2.0.1`).
- Resolved CI TypeScript checks by explicitly typing `QueryDocumentSnapshot` & `ReviewDoc` in `src/app/api/reviews/route.ts`, `Transaction` in `src/lib/security-store.ts`, and `expiresAt` casting in `tests/security/firestore.test.ts`.
- GitHub Actions CI/CD completed with full success and automatically deployed to Vercel Production.
- Pre-remediation sessions are rejected using `securityVersion: 2`; users must reauthenticate.
- OTPs and API rate limits use Firebase Admin Firestore transactions with HMAC-hashed identifiers.
- Resolved Vercel ERR_REQUIRE_ESM runtime crash on `/api/auth/*` and `/api/reviews` by decoupling `firebase-admin/auth` (lazy `getAdminAuth()` on demand for phone logins), overriding `jwks-rsa` to `3.1.0` (deduping with CommonJS `jose@4.15.9`), setting `serverExternalPackages: ["firebase-admin"]`, and creating `.nvmrc`/`.node-version` (Node 22).
- Added Email Code and Mobile SMS OTP login options alongside Google OAuth on `/account/login`.
- Cleaned up Profile Details notification banner to "Profile details updated successfully." with Quiet Luxury typography and styling.
- Added cryptographic phone verification flow in Profile Details (via Firebase Phone Auth SMS & verified ID token in `/api/profile`).
- External next steps:
  1. Rotate Shopify credentials (client secret & admin API tokens) in Shopify admin and update Vercel (completed).
  2. Verify canonical domain and OAuth redirect URLs (`https://www.mouleeta.shop`) (completed).
  3. Revisit Firestore TTL in Google Cloud Console now that production collections are active.
  4. Perform smoke/staging tests for auth, OTP, checkout, and tracking flows.

## OTP Delivery Remediation & Production Deployment (Oct 16, 2026)
- **Root Cause Identified**: The browser blocked Google reCAPTCHA during Firebase Phone Auth because `next.config.mjs` lacked `https://www.google.com`, `https://www.gstatic.com`, and `https://www.recaptcha.net` in `script-src`, `connect-src`, and `frame-src`. Without reCAPTCHA execution, Firebase's SMS gateway was never invoked.
- **CSP Resolution**: Updated `next.config.mjs` to comprehensively allow Google reCAPTCHA domains across `script-src`, `connect-src`, `frame-src`, `img-src`, and `style-src`. Verified live response headers on `https://www.mouleeta.shop/account/login`.
- **Phone Auth Hardening**:
  - Normalized all phone inputs to strict E.164 (stripping whitespace, parentheses, and dashes; defaulting 10-digit inputs to `+91`).
  - Added robust reCAPTCHA instance cleanup on failure to guarantee retry attempts receive a fresh verification challenge.
  - Added explicit user-friendly diagnostics for `auth/unauthorized-domain` and `auth/network-request-failed`.
- **Brand Consistency & Luxury Aesthetics**:
  - Eliminated all emojis across `PhoneOtpFlow.tsx`, `OtpVerificationModal.jsx`, and `src/app/account/register/page.tsx`.
  - Replaced third-party vendor strings ("via Resend", "via Firebase Auth") with brand-aligned Quiet Luxury copy ("Mouleeta Privé", "Resend Code").
  - Added inbox and spam/junk folder reminder text to the Email Code verification modal.
- **Verification & Deployment**:
  - Verified 0 ESLint errors, 0 TypeScript errors, 17/17 security tests passing, and 25/25 static pages compiled.
  - Pushed to `main` (`ed6e2c9`), passed CI/CD in 2m55s, and deployed live to Vercel production.
