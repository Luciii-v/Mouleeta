'use client';

import React, { useRef, useState } from 'react';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
};

interface AnimatedGridProps {
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedGrid({ children, className = '' }: AnimatedGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  


  // Parallax setup
  const { scrollYProgress } = useScroll();
  // Middle column scrolls slower by pushing it down progressively as you scroll down
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 150]);



  return (
    <motion.div
      ref={gridRef}
      variants={container}
      initial="hidden"
      animate="show"
      // Added perspective for Runway 3D effect
      className={`relative [perspective:1200px] ${className}`}
    >


      {React.Children.map(children, (child, index) => {
        // Assume 3-column layout based on sm:grid-cols-2 lg:grid-cols-3
        // So index % 3 === 1 is the middle column on desktop
        const isMiddleColumn = index % 3 === 1;

        return (
          <motion.div variants={item} className="w-full h-full relative">
            <motion.div style={isMiddleColumn ? { y: yParallax } : {}} className="w-full h-full">
              {child}
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
