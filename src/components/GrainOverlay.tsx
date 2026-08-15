'use client';

export default function GrainOverlay() {
  // Disabled due to severe performance issues on mobile/low-end devices.
  // The SVG feTurbulence filter over the entire document with mix-blend-mode 
  // causes continuous re-rasterization and layout thrashing during scroll.
  return null;
}
