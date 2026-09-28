# Production Readiness Audit: MOULEETA V.2

I have thoroughly reviewed the codebase for production readiness. **The website is NOT ready for consumers.** There are several critical pieces of test data, mocked APIs, and sandbox configurations still heavily embedded in your application. Releasing the site in its current state will result in a severely broken and unprofessional user experience.

Here is the detailed breakdown of what needs to be fixed before launch:

### 🔴 Critical Security & Payment Issues
- **Razorpay Test Keys in Production:** Your `.env.production` file contains a test key: `NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_SuuQg4oEkqOGnz`. If Razorpay is used anywhere in the checkout or wallet flow, customers will not be charged real money, or payments will fail entirely. You must replace this with a live key (`rzp_live_...`).

### 🔴 Completely Broken or Mocked APIs
- **Returns API is Fake:** In `src/app/api/returns/route.ts`, the entire endpoint is a mock. It has a `TODO: Actually save this return request to the database or Shopify`. It just returns a fake `returnId` (`RET-123456789...`) without actually processing the return or saving it anywhere.
- **Shiprocket Tracking Fallback:** In `src/app/api/track/route.js`, if the Shiprocket API token is missing or fails, the system falls back to returning a highly detailed, fake tracking simulation (e.g., "Package Delivered & Signed by VIP Concierge", "Mouleeta Atelier"). Customers tracking real packages might see this fake data instead of an error if the API fails.
- **OTP Sandbox Mode:** In `src/app/api/otp/send/route.js`, there is a dev/sandbox fallback that exposes the OTP in the API response. You need to ensure `ENABLE_OTP_SANDBOX` is firmly set to `false` in production, otherwise, anyone could bypass phone verification by reading the network response.

### 🔴 Hardcoded Localhost Configurations
- **Shopify App Installation:** In `src/app/api/shopify-install/route.ts`, the `redirectUri` is hardcoded to `"http://localhost:3000/api/shopify-install/callback"`. If you are using this route to authenticate with Shopify in production, it will immediately redirect the user to a broken localhost page.
- **NextAuth URL in .env.local:** Your `.env.local` contains `NEXTAUTH_URL=http://localhost:3000`. Make sure this is only ever used locally. Your `.env.production` correctly has `https://www.mouleeta.shop`, which is good.

### 🟡 Architecture & Code Quality Smells
- **Sandbox Components used on Live Pages:** Core customer pages like `app/shop/page.tsx`, `app/products/[handle]/page.tsx`, and `app/collections/[handle]/page.tsx` are using components named `SandboxProductCard` and `SandboxProductDetail`. These components contain fallback logic and hardcoded "sandbox" links (e.g., in `SandboxProductDetail.tsx`, line 382 explicitly links to `/sandbox`). They should be cleaned up and renamed, or replaced with the final production components (like `ProductDetail.tsx`).
- **Dummy Data Files:** `src/lib/dummyData.ts` contains `mockCategories`, `mockSubCategories`, and `mockProducts`. You should verify that none of the live production pages are mapping over this hardcoded data.

### 📋 Recommended Next Steps
1. Replace all `test` keys in `.env.production` with live keys.
2. Implement the database/Shopify GraphQL integration in the `returns` API.
3. Remove the simulated tracking fallback in `track/route.js` and instead return a clear error if the tracking API fails.
4. Replace `localhost:3000` with the production domain (`https://www.mouleeta.shop`) in `shopify-install`.
5. Audit the `Sandbox` UI components, remove hardcoded fallback logic, and rename them to standard components before launch.
