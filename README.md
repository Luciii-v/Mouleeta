# MOULEETA — Cinematic E-commerce Frontend

An ultra-premium, high-contrast, minimalist architectural fashion e-commerce storefront for **MOULEETA** — a sustainable clothing brand that treats fashion as wear-art. 

This repository serves as a production-ready, high-fidelity backup landing page and product exploration flow constructed using Next.js, React, TypeScript, and Tailwind CSS v4.

---

## 1. Brand Philosophy & Aesthetic Rules
Mouleeta's identity is rooted in **Cinematic Minimalism** — mimicking high-end print editorial fashion magazines. 
*   **Tactile Canvas**: Warm, textile-like bone off-white (`#f6f1e8`) backdrop.
*   **High-Contrast Copy**: Crisp onyx black (`#231f20`) typography, borders, and accents.
*   **Perfect 90° Geometry**: Absolute zero border radius on all visual nodes (buttons, grids, cards, inputs) to enforce architectural structure.
*   **Negative Space**: Spanning horizontal and vertical section gaps (`160px` vertical margins) to let products breathe like framed artwork.

*For comprehensive token specifications and typographic rules, read the **[DESIGN.md](./DESIGN.md)** file.*

---

## 2. Technical Stack
*   **Core**: [Next.js](https://nextjs.org/) (v16 App Router) & [React](https://react.dev/) (v19)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using lightning-fast native css `@import` configurations and theme definitions)
*   **Language**: [TypeScript](https://www.typescriptlang.org/) for complete compilation safety and static typing.
*   **Routing**: Next.js client-side pre-rendered static routes with soft page-entry fade transitions.

---

## 3. Structural Features & Interactions
*   **Responsive Sticky Navigation**: Scroll-responsive header that reduces vertical breathing room and increases backdrop opacity as the page scrolls. Includes an expandable mobile drawer.
*   **Parallax Hero Cover**: High-end fashion cover photo translating coordinates on user scroll for immersive depth.
*   **Asymmetric Arrivals Bento Grid**: 12-column editorial catalog featuring scroll reveal slide-ups that track page view boundaries.
*   **Interactive Product Flow (`/product/architects-tunic`)**:
    *   **Interactive Swatches**: Fully responsive state-managed color selection ("Bone White", "Onyx Black", "Stone Grey") and sizing swatches.
    *   **Expanding Accordions**: Lightweight toggle hooks to inspect details, fabric care guide, and carbon-neutral shipping terms.
    *   **Minimalist Email Form**: Clean bottom-border subscription input with success feedback indicators.

---

## 4. Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Installation
1. Clone this repository to your local system:
   ```bash
   git clone https://github.com/Luciii-v/Mouleeta.git
   cd Mouleeta
   ```

2. Install the production and development dependencies:
   ```bash
   npm install
   ```

### Development Server
Run the local server in development mode:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to preview.

### Build and Optimize
Compile the static optimized production bundle:
```bash
npm run build
```
This builds statically optimized pages with absolute type safety and registers local pre-rendering outputs.
