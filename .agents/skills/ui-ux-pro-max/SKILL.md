---
name: ui-ux-pro-max
description: Guidelines and instructions for creating high-fidelity, luxury editorial web interfaces and micro-animations for premium brands.
---

# UI/UX Pro Max — Luxury Fashion Design System

This skill enforces high-fidelity luxury design aesthetics, interactive micro-animations, and mobile-first responsive guidelines tailored specifically for the MOULEETA brand.

---

## 🎨 1. Luxury Brand Aesthetics

- **Color Palette**:
  - Primary Background: Warm ivory/off-white (`#FAF8F5` or `#FDFBF7`).
  - Typography/Accents: Dark charcoal/onyx (`#1A1A1A` or `#2E2E2E`).
  - Subtle Borders: Stone/neutral (`#E5E5E5` or `#F5EFE7`).
  - Active States: Soft emerald (`#10B981` / `#059669`) for positive feedback; warning states in soft amber. Avoid neon or standard primary colors.
- **Typography Hierarchy**:
  - Headers & Call-to-actions: Jost / Playfair (light weights, uppercase, tracking `[0.2em]` or `[0.25em]`).
  - Body Text: Inter / Roboto (regular/light weights, high line-height, charcoal tint).

---

## ✨ 2. Micro-Animations (Framer Motion)

All components should feel fluid and alive. Avoid abrupt CSS state swaps.
- **Image Hover Zoom**: Aspire to a scale of `1.02` to `1.05` over `0.7s` using a smooth cubic-bezier (`[0.16, 1, 0.3, 1]`).
- **Sliding Drawers**: Drawer transitions (like Cart, Search, Mobile Navigation) must slide in from edges (e.g., `x: '-100%'` to `x: 0`) using spring dynamics:
  ```ts
  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
  ```
- **Staggered Reveals**: Lists, product grids, and navigation elements should stagger entry fade-ins to create a high-end editorial reveal.

---

## 📱 3. Mobile-First Optimization

- **Navigation**: Always build full-screen or sliding drawer overlays for mobile views instead of simple toggle dropdowns.
- **Tap Targets**: Mobile buttons and interactive links must have at least a `44px` height target to accommodate touch gestures.
- **Add to Bag**: Desktop uses hover overlays; mobile must display visible, full-width solid black action bars right below the product info for seamless shopping.

---

## ⚡ 4. Image & Video Optimization

- **Sizing**: Constrain image sizes dynamically using Next.js `Image` component. Always specify `sizes` attributes (e.g., `sizes="(max-width: 768px) 100vw, 33vw"`) to prevent loading full-size images on mobile.
- **Compression**: All raw JPEG assets must be converted and scaled down to a maximum dimension of `2000px` (quality `80-85%`) to comply with Core Web Vitals (LCP/INP).
