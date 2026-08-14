'use client';

export default function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 0.04, /* Static opacity prevents lighting flashes */
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
