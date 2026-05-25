# MOULEETA — Design System & Aesthetic Rules

This document locks in the official brand rules, tokens, and aesthetic principles for Mouleeta. All code written for the frontend must conform strictly to these patterns.

---

## 1. Brand Philosophy
**Cinematic Minimalism**: A high-contrast, editorial layout that prioritizes whitespace, dramatic framing, and a quiet, tactile luxury feel. Think of pages as virtual art gallery walls framing sustainable architectural garments.

---

## 2. Color Palette
Depth is built exclusively through flat layering of colors and high-contrast composition. No gradients, soft drop shadows, or vibrant accent colors.

| Token | Hex Code | Purpose / Usage |
| :--- | :--- | :--- |
| `surface` / `bone` | `#f6f1e8` | The warm primary canvas backdrop (evokes premium textile / recycled paper). |
| `on-surface` / `onyx` | `#231f20` | All core typography, borders, logos, and filled brand forms. |
| `paper-highlight` | `#ffffff` | Absolute white, reserved strictly for highlighting key elements or sheets. |
| `graphite-muted` | `#4a4647` | Muted content, body subtexts, and low-priority labels. |
| `outline` | `#7e7577` | Fine border boundaries and UI structure dividers. |

---

## 3. Shapes & Corners
*   **Corner Radius: Strictly `0` (Sharp, 90-degree angles).**
*   All buttons, input fields, image grids, and cards must maintain perfectly sharp geometric corners. Rounded aesthetics (e.g., `rounded-lg`, `rounded-full` for anything other than circular swatches) are strictly forbidden.

---

## 4. Typography System
Fonts are loaded dynamically via premium typography providers to maximize screen legibility.

### Headline Typography: Metropolis
A modern, geometric sans-serif emphasizing structure and crisp typographic contrast.
*   **display-lg**: `84px` | Line-height `92px` | Weight `300` | Letter-spacing `-0.02em` (Mobile fallback: `28px` / Line-height `36px`)
*   **headline-xl**: `48px` | Line-height `56px` | Weight `400` | Letter-spacing `-0.01em`
*   **headline-lg**: `32px` | Line-height `40px` | Weight `400`

### Body Typography: Libre Franklin
A humanist, clean sans-serif for comfortable long-form reading and functional copy.
*   **body-lg**: `18px` | Line-height `28px` | Weight `400`
*   **body-md**: `16px` | Line-height `24px` | Weight `400`
*   **label-caps**: `12px` | Line-height `16px` | Weight `600` | Letter-spacing `0.15em` (all caps)
*   **label-md**: `14px` | Line-height `20px` | Weight `500`

---

## 5. Spacing Grid & Rhythm
Driven by an `8px` base unit. Layouts use an asymmetrical, editorial-driven grid structure to evoke a print magazine experience.

*   **Max Container Width**: `1440px`
*   **Desktop Margin**: `64px` (left/right padding)
*   **Mobile Margin**: `20px` (left/right padding)
*   **Section Gap**: `160px` (large vertical negative spaces to let designs breathe)
*   **Gutter**: `24px`

---

## 6. Interaction & Cinematic Motion
Instead of blur effects or heavy transitions, the interface feels alive through discrete, high-performance interactions.
*   **Parallax**: Slow vertical scroll offsets for high-resolution background photographs.
*   **Tonal Layering**: Hovering a hollow button transforms it into a solid onyx fill with bone text.
*   **Reveal Animations**: Delicate, scroll-triggered slide-ups (`translateY` offset of `40px` to `0px` with cubic-bezier transition curves) to highlight layout structure dynamically.
