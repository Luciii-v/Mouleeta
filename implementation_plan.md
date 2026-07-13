# UI/UX PLP Overhaul & Accessibility Updates

## User Review Required
> [!IMPORTANT]
> I have documented your new requirements for improving user control and accessibility.
> 
> Please review this updated plan and approve it so I can begin the next phase of execution!

## Proposed Changes

# Typographic Hierarchy Overhaul

This plan addresses the "flatness" of the current typography by introducing a true dual-voice system, massive scale jumps, deliberate font-weight contrast, and refined color/tone hierarchy to create a luxury editorial feel.

## User Review Required

> [!IMPORTANT]
> **Open Question: The Second Voice (Headline Font)**
> To create a stark contrast with your highly-tracked, all-caps sans-serif (Jost), we need a distinct headline font. 
> 
> **My Recommendation:** We should introduce an elegant, classic Serif font (e.g., **Playfair Display** or **EB Garamond**). This is the hallmark of luxury editorial design. We would use this serif in standard casing (Title Case or Sentence case) with zero or tight tracking, paired against your existing wide-tracked Jost labels.
> 
> **Do you approve adding a Serif font like Playfair Display for headlines, or would you prefer a different typographic direction for the "second voice"?**

## Proposed Changes

### 1. Global Font System
#### [MODIFY] [layout.tsx](file:///Users/mahathavivaanveer/Developer/MOULEETA%20V.2/src/app/layout.tsx)
- Import and inject a new Google Font (e.g., `Playfair Display`) as `--font-editorial` to serve as the new primary headline voice.

### 2. The Hero Spread
#### [MODIFY] [Hero.tsx](file:///Users/mahathavivaanveer/Developer/MOULEETA%20V.2/src/components/Hero.tsx)
- Change the massive "TIMELESS ELEGANCE" text to use the new editorial serif in standard casing (e.g., "Timeless Elegance" or "Timeless *Elegance*").
- Drastically increase the size jump (e.g., `text-8xl md:text-[10rem]`).
- Remove the extreme tracking (`tracking-[0.25em]`) from the headline.
- Introduce font-weight contrast (e.g., making one word italicized or slightly bolder).

### 3. Account Dashboard Editorial Pass
#### [MODIFY] [page.tsx](file:///Users/mahathavivaanveer/Developer/MOULEETA%20V.2/src/app/account/page.tsx)
- **Welcome Headline:** Change "WELCOME, LUCI V" to the new serif, standard case, significantly larger (`text-5xl md:text-7xl`), and without wide tracking.
- **Section Headlines:** Change "THE ARCHIVE", "SAVED ADDRESSES" to the serif, standard case (`text-4xl`).
- **Body & Labels:** Keep the wide-tracked Jost caps *only* for true labels/accents (e.g., "VIP TIER", "DELIVERED"), ensuring they look like distinct children to the headline parents.
- **Tone Hierarchy:** Increase contrast. Make headlines stark black/dark stone, while keeping body copy muted to emphasize the scale jumps.

### 4. Footer Overhaul
#### [MODIFY] [Footer.tsx](file:///Users/mahathavivaanveer/Developer/MOULEETA%20V.2/src/components/Footer.tsx)
- Change "JOIN OUR JOURNEY" to the new editorial serif in standard casing (e.g., "Join Our Journey"), bumping the size up to `text-6xl md:text-7xl`.
- Leave the column headers ("SHOP", "ABOUT") as the tracked-out Jost accent font.

## Verification Plan
- Visually verify that the new serif font loads correctly.
- Check that headlines are no longer using `uppercase tracking-[0.2em]` but instead leverage the new editorial style.
- Confirm the size jumps between headlines and body text feel dramatically larger and more cinematic.

### 8. Broken "Empty State" Grid Layout
#### [MODIFY] [page.tsx](file:///Users/mahathavivaanveer/Developer/MOULEETA%20V.2/src/app/collections/[handle]/page.tsx) (Collection route)
- If `products.length === 1`, we will override the strict grid and apply a centered layout, accompanied by a styled "More styles arriving soon" banner to avoid massive white space.

## Verification Plan

### Manual Verification
- **Swatch Test**: Click swatches on product cards and verify the image updates instantly.
- **Manual Pin Test**: Ensure scrolling over items does not add them to the dock. Click "Pin" to ensure they are added.
- **Resize Test**: Drag the corner of the Memory Dock to verify it smoothly scales up and down within constraints.
- **Mobile Test**: Switch to a mobile viewport, verify the dock respects safe areas and allows swiping.
- **Cart/Dock Z-Index Test**: Open the cart and ensure the Memory Dock is completely hidden.
- **Hover Clarity Test**: Hover over a product and verify the UI is not cluttered with dots/swatches simultaneously.
- **Mega Menu Overlay Test**: Hover "Shop" to open the Mega Menu and verify the dark, blurred backdrop appears over the rest of the site.
- **Single Product Layout Test**: Navigate to the "Co-ord Sets" collection and verify the single item is beautifully centered with a fallback banner.