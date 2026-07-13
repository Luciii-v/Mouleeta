'use client';

import { useEffect, useRef } from 'react';
import { useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';

export default function GrainOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.5,
  });

  const grainOpacity = useTransform(
    smoothVelocity,
    [-1500, -800, -200, 0, 200, 800, 1500],
    [0.18, 0.12, 0.05, 0.03, 0.05, 0.12, 0.18]
  );

  const turbulenceIntensity = useTransform(
    smoothVelocity,
    [-1500, 0, 1500],
    [0.72, 0.65, 0.72]
  );

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const turbulence = overlay.querySelector<SVGFETurbulenceElement>('feTurbulence');

    const unsubOpacity = grainOpacity.on('change', (v) => {
      overlay.style.opacity = String(v);
    });

    const unsubTurbulence = turbulenceIntensity.on('change', (v) => {
      if (turbulence) {
        turbulence.setAttribute('baseFrequency', `${v}`);
      }
    });

    return () => {
      unsubOpacity();
      unsubTurbulence();
    };
  }, [grainOpacity, turbulenceIntensity]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 0.03,
        willChange: 'opacity',
        mixBlendMode: 'multiply',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        style={{ display: 'block' }}
      >
        <filter id="mouleeta-grain" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="4"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            type="saturate"
            values="0"
            in="noise"
            result="grayNoise"
          />
          <feBlend
            in="SourceGraphic"
            in2="grayNoise"
            mode="multiply"
            result="blended"
          />
          <feComponentTransfer in="blended">
            <feFuncA type="linear" slope="1" />
          </feComponentTransfer>
        </filter>

        <rect
          width="100%"
          height="100%"
          filter="url(#mouleeta-grain)"
          fill="#1A1A1A"
        />
      </svg>
    </div>
  );
}
