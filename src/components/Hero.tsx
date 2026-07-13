'use client';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import MagneticButton from '@/components/MagneticButton';

export default function Hero() {
  const containerRef = useRef(null);
  
  // 1. Capture the raw scroll percentage
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // 2. Add the Physics Shock Absorber (The GSAP secret)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // 3. Use smoothProgress instead of scrollYProgress for ALL transforms
  const leftTextX = useTransform(smoothProgress, [0, 1], ["0%", "-150%"]);
  const rightTextX = useTransform(smoothProgress, [0, 1], ["0%", "150%"]);
  const buttonOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);
  const buttonScale = useTransform(smoothProgress, [0, 0.5], [1, 0.8]);
  const indicatorStretch = useTransform(smoothProgress, [0, 1], ["0%", "400%"]);

  return (
    <div ref={containerRef} className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#F9F8F6]">
      
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none z-0"
        autoPlay
        loop
        muted
        playsInline
        poster="/placeholder.png"
        {...{ fetchPriority: 'high' } as Record<string, string>}
      >
        <source src="/videos/final-home-video.mp4" type="video/mp4" />
      </video>

      {/* Badge */}
      <motion.div style={{ opacity: buttonOpacity }} className="mb-6 border border-white/20 rounded-full px-6 py-2 z-20">
        <span className="font-jost text-xs tracking-[0.2em] text-white/90">LUXURY CRAFTED</span>
      </motion.div>

      {/* The Parallax Split Text */}
      <div className="flex flex-col items-center justify-center z-10 w-full whitespace-nowrap">
        <motion.h1 
          style={{ x: leftTextX }} 
          className="font-jost font-light text-7xl md:text-8xl tracking-[0.25em] text-[#1A1A1A] ml-8"
        >
          TIMELESS
        </motion.h1>
        <motion.h1 
          style={{ x: rightTextX }} 
          className="font-jost font-light text-7xl md:text-8xl tracking-[0.25em] text-[#999999] -mr-8"
        >
          ELEGANCE
        </motion.h1>
      </div>

      {/* Button & Subtitle */}
      <motion.div 
        style={{ opacity: buttonOpacity, scale: buttonScale }} 
        className="mt-12 flex flex-col items-center z-20"
      >
        <p className="font-inter text-white/80 mb-8 max-w-md text-center text-sm">
          Discover our collection of consciously crafted pieces, where luxury meets sustainability.
        </p>
        <MagneticButton strength={25}>
          <Link 
            href="/collections/dresses" 
            className="group bg-stone-900 text-white text-xs tracking-[0.2em] uppercase px-12 py-5 hover:bg-stone-800 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>Explore Collection</span>
            <span className="transition-transform duration-300 ease-out group-hover:translate-x-2">
              →
            </span>
          </Link>
        </MagneticButton>
      </motion.div>

      {/* The Scrubbed Scroll Indicator */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center h-32 w-[1px] z-20">
        <motion.div 
          style={{ y: indicatorStretch }}
          className="w-full h-full bg-[#1A1A1A] origin-top"
        />
      </div>
    </div>
  );
}
