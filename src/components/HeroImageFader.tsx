'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroImageFaderProps {
  images: string[];
  interval?: number; // Time in ms between transitions
  altText?: string;
}

export default function HeroImageFader({ images, interval = 4000, altText = "Collection Image" }: HeroImageFaderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  if (!images || images.length === 0) {
    return (
      <Image
        src="/placeholder.png"
        alt={altText}
        fill
        priority
        className="object-cover opacity-80"
        draggable={false}
      />
    );
  }

  // If there's only one image, just render it without animation logic
  if (images.length === 1) {
    return (
      <Image
        src={images[0]}
        alt={altText}
        fill
        priority
        className="object-cover opacity-80"
        draggable={false}
      />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#1A1A1A]">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex]}
            alt={`${altText} - view ${currentIndex + 1}`}
            fill
            priority={currentIndex === 0}
            className="object-cover"
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
