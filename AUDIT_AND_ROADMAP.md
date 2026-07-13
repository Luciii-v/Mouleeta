# MOULEETA V.2 — Comprehensive Audit & Implementation Roadmap

This document serves as the master specification of all architectural, functional, and aesthetic improvements required to elevate **MOULEETA V.2** into a production-grade, luxury e-commerce platform.

---

## Executive Summary & Phase Breakdown

| Phase | Focus Area | Goal | Status |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Critical Fixes** | Resolve build errors, strict linting failures, broken routing, and disconnected checkout endpoints. | **Completed** (0 errors, 0 warnings, build passing) |
| **Phase 2** | **Missing Features** | Complete authentication flows, customer profile pages, navigation consistency, and product card link functionality. | **Completed** (Auth, Profile, and Links wired) |
| **Phase 3** | **Polish & UX** | Unify global footer/drawer mounting, optimize Core Web Vitals (LCP images), clean up TODOs, and enhance SEO metadata. | **Completed** |

---

## Phase 1: Critical Fixes (Build Blockers, Errors & Broken Flows)

### 1.1 Resolve Fatal Build Error in Legacy Product Slug Route
* **File**: `src/app/shop/[category]/[subCategory]/[productSlug]/page.tsx`
* **Problem**: The page passes a mock product from `mockProducts` (`@/lib/dummyData.ts`) into `<ProductDetail />`. However, `ProductDetail` strictly requires a Shopify GraphQL `Product` type (`handle`, `descriptionHtml`, `priceRange`, `images.edges`, etc.), causing `npm run build` to fail with exit code 1.
* **Planned Edit**: Remove or deprecate this legacy mock-data route and redirect/unify it with the canonical Shopify storefront route `src/app/products/[handle]/page.tsx`.

### 1.2 Fix 46 ESLint Errors & Warnings (CI/CD Pipeline Blocker)
* **Unescaped Quotes (`"` & `'`)**:
  * `src/app/policies/terms/page.tsx` (lines 13, 51)
  * `src/components/ProductDetail.tsx` (lines 417, 420, 423, 426)
  * `src/components/ProductForm.tsx` (lines 180, 183, 186, 189)
  * **Planned Edit**: Replace unescaped quotes with valid HTML entities (`&quot;`, `&ldquo;`, `&rdquo;`, `&rsquo;`).
* **Explicit `any` Type Violations**:
  * `src/lib/shopify.ts` (11 occurrences across fetchers and mappers)
  * `src/components/CartDrawer.tsx` (lines 11, 151)
  * `src/components/ProductCarousel.tsx` (lines 10, 100, 103)
  * `src/app/api/checkout/route.ts` (line 42) & `src/app/api/checkout/verify/route.ts` (line 22)
  * **Planned Edit**: Replace `any` with strongly typed TypeScript interfaces (`ShopifyProduct`, `CartItem`, `RazorpayOrderOptions`, etc.).
* **React Hooks Dependency Warning**:
  * `src/components/ProductCarousel.tsx` (line 53)
  * **Planned Edit**: Properly memoize `handleScroll` with `useCallback` or add it to the `useEffect` dependency array.

### 1.3 Clean Up Disconnected Razorpay / Custom Checkout Endpoints
* **Files**: `src/components/CartDrawer.tsx`, `src/app/api/checkout/route.ts`, `src/app/api/checkout/verify/route.ts`, `src/app/api/checkout/create-shopify-order/route.ts`
* **Problem**: When a customer clicks "Checkout" in CartDrawer, `window.location.href` redirects directly to Shopify Hosted Checkout (`newCart.checkoutUrl`). Yet, custom Razorpay backend endpoints exist and are completely disconnected from the frontend.
* **Planned Edit**: Since Shopify Storefront Hosted Checkout is the primary production flow, cleanly comment/document or remove the unused custom Razorpay API endpoints to prevent dead code and maintenance confusion.

### 1.4 Fix Incompatible Variant ID Passing in Carousel & Collection Components
* **Files**: `src/components/ProductCarousel.tsx` (line 179) & `src/components/Collection.tsx` (line 80)
* **Problem**: When clicking "Add to Cart/Bag", fallback dummy data (`mockProducts`) passes plain strings (`"white-georgette-flow-dress"`) as `variantId`. Passing non-GraphQL IDs (`gid://shopify/ProductVariant/...`) to Shopify cart creation mutations crashes the Storefront API request.
* **Planned Edit**: Ensure fallback products provide valid format IDs or add a runtime check in `useCartStore` / `addToCart` to handle static showcase items gracefully without breaking checkout.

### 1.5 Fix Next.js 15+ Async `params` Type Contract Violation
* **File**: `src/app/collections/[handle]/page.tsx` (line 4)
* **Problem**: In Next.js 15/16, route `params` are asynchronous Promises. While line 5 properly awaits `params`, the function parameter signature on line 4 is typed synchronously (`{ params: { handle: string } }`).
* **Planned Edit**: Update the type signature to `{ params: Promise<{ handle: string }> }`.

---

## Phase 2: Missing Features (Incomplete Flows & Functionality)

### 2.1 [COMPLETED] Wire Up Authentication Forms (Email/Password Login & Register)
* **Files**: `src/app/account/login/page.tsx` & `src/app/account/register/page.tsx`
* **Problem**: The email/password `<form>` elements have no `onSubmit` handlers or form actions. Only Google SSO works via NextAuth.
* **Resolution**: Both forms now have `handleSubmit` handlers connected to NextAuth `CredentialsProvider`. Validation, loading states, and error handling are fully wired.

### 2.2 [COMPLETED] Create Customer Account Dashboard (`/account`)
* **Folder**: `src/app/account`
* **Problem**: Only login, register, and recover pages exist. There is no authenticated profile/dashboard page.
* **Resolution**: Created `src/app/account/page.tsx` with auth-gated rendering, 3-tab dashboard (Orders, Addresses, Profile), VIP tier badge, and luxury editorial styling.

### 2.3 [COMPLETED] Unify Category Navigation & Remove Legacy URL Schism
* **Files**: `src/components/Hero.tsx`, `src/components/MegaMenu.tsx`, `src/app/shop/...`
* **Problem**: `Hero.tsx` links to legacy `/shop/women/dresses` (which renders static mock data), while `MegaMenu.tsx` links to dynamic `/collections/dresses`. Furthermore, `/shop/[category]/page.tsx` is missing (causing a 404).
* **Resolution**: Hero and MegaMenu now point to `/collections/` routes. All legacy `/shop/[category]`, `/shop/[category]/[subCategory]`, and `/shop/.../[productSlug]` routes converted to `redirect()` to their canonical equivalents.

### 2.4 [COMPLETED] Make Product Cards Clickable in the Spring Collection Grid
* **File**: `src/components/Collection.tsx`
* **Problem**: In the Spring Collection section on the home page, product images and titles are rendered inside static `<div>` containers without `<Link>` tags.
* **Resolution**: Product image frames (line 72) and titles (line 125) are now wrapped in `<Link href={/products/${product.slug}}>` with hover transitions.

### 2.5 [COMPLETED] Remove Orphaned Components & Unused Database Dependencies
* **Files**: `src/components/ProductCard.tsx`, `src/components/AnimatedProductGrid.tsx`, `package.json`
* **Problem**: Components are implemented but never imported or used. `prisma` is listed in devDependencies without any schema or connection.
* **Resolution**: Orphaned `ProductCard.tsx` and `AnimatedProductGrid.tsx` deleted. Prisma removed from dependencies. Zero orphaned component files remain.

### 2.6 [COMPLETED] "Mouleeta Privé" Wishlist & Curated Closet (`/wishlist`)
* **Files**: `src/components/Collection.tsx`, `src/components/ProductCarousel.tsx`, `src/app/wishlist/page.tsx`
* **Problem**: Luxury shoppers need to save pieces for evening wear and wardrobe planning across sessions.
* **Planned Edit**: Implement heart toggle icons on product cards, create a persistent Zustand wishlist store (`useWishlistStore`), and build a dedicated `/wishlist` curated closet gallery.

### 2.7 [COMPLETED] Bespoke Editorial Search & Discovery Modal (`⌘K`)
* **Files**: `src/components/Header.tsx`, `src/components/SearchModal.tsx`
* **Problem**: High-intent shoppers lack instant global search across products, silhouettes, and collections.
* **Planned Edit**: Add a `⌘K` search trigger in `Header.tsx` opening a glassmorphic search overlay with real-time product filtering and luxury trending tags.

### 2.8 [COMPLETED] Interactive Size & Fit Concierge ("Find My Size")
* **File**: `src/components/ProductDetail.tsx`, `src/components/FitConciergeModal.tsx`
* **Problem**: Fit uncertainty drives drop-offs and returns in high-end fashion.
* **Planned Edit**: Upgrade the size guide modal into an interactive measurement calculator recommending precise Mouleeta sizes and tailored fit advice.

### 2.9 [COMPLETED] "Complete the Look" / Style Recommendations (`Styled With`)
* **File**: `src/components/ProductDetail.tsx`, `src/components/StyledWith.tsx`
* **Problem**: Missing cross-selling opportunities for co-ords, trousers, and complementary accessories.
* **Planned Edit**: Add a "Styled With" cross-sell section on product detail pages allowing one-click outfit additions to bag.

### 2.10 [COMPLETED] WhatsApp VIP Personal Shopping Concierge (`<VIPConcierge />`)
* **File**: `src/components/ProductDetail.tsx`, `src/components/VIPConcierge.tsx`
* **Problem**: High-net-worth clients expect direct human styling and bespoke sizing assistance.
* **Planned Edit**: Add a contextual WhatsApp VIP Concierge button pre-filled with product title and URL for instant personal shopping support.

### 2.11 [COMPLETED] Live Order Tracking & White-Glove Returns Portal (`/track`)
* **File**: `src/app/track/page.tsx`, `src/components/Header.tsx`, `src/components/Footer.tsx`
* **Problem**: Self-service post-purchase tracking and return initiation is missing.
* **Planned Edit**: Create an order lookup portal (`/track`) showing visual shipping milestones and exchange initiation.

### 2.12 [COMPLETED] "Recently Admired" Browsing History Bar
* **Files**: `src/components/RecentlyViewed.tsx`, `src/components/ProductDetail.tsx`
* **Problem**: Users lose track of pieces admired earlier in their session.
* **Planned Edit**: Implement a subtle session history carousel at the bottom of product detail pages.

---

## Phase 3: Polish (UI/UX, Layout Symmetry, SEO & Performance)

### 3.1 Unify Global `<Footer />` & Eliminate Duplicate `<CartDrawer />` Mounts [COMPLETED]
* **Files**: `src/app/layout.tsx`, `src/app/shop/...`, `src/app/products/...`
* **Problem**: `<CartDrawer />` is globally mounted in `RootLayout`, but mounted a second time in subcategory pages. Meanwhile, `<Footer />` is NOT in `RootLayout`, causing major pages (`/shop`, `/products/[handle]`, `/collections/[handle]`, and auth pages) to completely lack a footer.
* **Planned Edit**: Move `<Footer />` directly into `src/app/layout.tsx` (so it appears on every page automatically) and remove duplicate manual `<Footer />` and `<CartDrawer />` imports across individual page components.

### 3.2 Fix Next.js Image Optimization Warnings (`<img>` vs `<Image />`) [COMPLETED]
* **Files**: `src/components/Header.tsx` (line 147) & `src/components/Footer.tsx` (line 67)
* **Problem**: Raw HTML `<img>` tags are used for brand logos and payment badges instead of `next/image`, causing LCP penalties.
* **Planned Edit**: Convert all standard `<img>` elements to `<Image />` with appropriate dimensions and priority flags.

### 3.3 [COMPLETED] Clean Up MegaMenu TODOs & Placeholder Links
* **File**: `src/components/MegaMenu.tsx`
* **Problem**: Contains inline TODO comments and hardcoded `#` or `/shop` placeholder links for curated edits.
* **Completed**: All MegaMenu links now point to real `/collections/[handle]` routes. Curated edits link to aspirational Shopify collection handles. No TODO comments or `#` placeholders remain.

### 3.4 [COMPLETED] Implement Dynamic SEO & OpenGraph Metadata
* **Files**: `src/app/products/[handle]/page.tsx` & `src/app/collections/[handle]/page.tsx`
* **Problem**: Metadata is mostly static in the root layout.
* **Completed**: Both product and collection pages have full `generateMetadata` functions serving dynamic titles, descriptions, canonical URLs, OpenGraph images, and Twitter cards.
