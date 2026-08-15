'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';

interface CollectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: { node: any }[];
}

export default function Collection({ products }: CollectionProps) {
  const [isDesktop, setIsDesktop] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-swipe functionality
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollInterval: NodeJS.Timeout | null = null;
    let resumeTimeout: NodeJS.Timeout | null = null;
    let animationFrameId: number | null = null;

    const smoothScroll = (targetX: number, duration: number) => {
      if (!container) return;
      const startX = container.scrollLeft;
      const distance = targetX - startX;
      let startTime: number | null = null;

      container.style.scrollSnapType = 'none';

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Ease In Out Cubic
        const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        container.scrollLeft = startX + distance * ease(progress);

        if (timeElapsed < duration) {
          animationFrameId = requestAnimationFrame(animation);
        } else {
          container.style.scrollSnapType = 'x mandatory';
          animationFrameId = null;
        }
      };

      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(animation);
    };

    const startAutoScroll = () => {
      if (scrollInterval) clearInterval(scrollInterval);
      scrollInterval = setInterval(() => {
        if (!container) return;
        
        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        if (scrollLeft >= maxScroll - 10) {
          smoothScroll(0, 1500); // 1.5s duration for a slow glide
        } else {
          const cardWidth = isDesktop ? container.clientWidth / 3 : container.clientWidth * 0.85;
          smoothScroll(scrollLeft + cardWidth, 1500);
        }
      }, 4500); // 4.5s interval
    };

    startAutoScroll();

    // Pause auto-scroll when user interacts, and debounce the restart
    const handleInteraction = () => {
      if (scrollInterval) clearInterval(scrollInterval);
      if (resumeTimeout) clearTimeout(resumeTimeout);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        if (container) container.style.scrollSnapType = 'x mandatory';
      }
      
      resumeTimeout = setTimeout(() => {
        startAutoScroll();
      }, 5000);
    };

    container.addEventListener('touchstart', handleInteraction, { passive: true });
    container.addEventListener('mousedown', handleInteraction, { passive: true });
    container.addEventListener('wheel', handleInteraction, { passive: true });

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
      if (resumeTimeout) clearTimeout(resumeTimeout);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (container) {
        container.removeEventListener('touchstart', handleInteraction);
        container.removeEventListener('mousedown', handleInteraction);
        container.removeEventListener('wheel', handleInteraction);
      }
    };
  }, [isDesktop]);

  return (
    <section
      id="collection"
      className="py-24 md:py-36 bg-bone scroll-mt-16 select-none relative group/carousel overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center mb-16 text-center">
          <span className="font-metropolis font-light text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#1A1A1A]/50 block mb-3">
            New Arrivals
          </span>
          <h2 className="font-jost font-light text-2xl sm:text-3xl md:text-[36px] text-[#1A1A1A] tracking-[0.25em] uppercase leading-none">
            Spring Collection
          </h2>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative w-full">
          
          {/* Sliding motion track */}
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto snap-x snap-mandatory scrollbar-hide w-full py-8 -my-8 pb-4"
          >
            <div className="flex w-max md:w-full gap-4 md:gap-0">
              {products.map((productEdge, index) => {
                const product = productEdge.node;
                return (
                  <div
                    key={product.id}
                    className={`w-[85vw] sm:w-[50vw] md:w-1/3 flex-shrink-0 px-2 md:px-4 snap-center md:snap-start group/gravity ${index % 2 === 0 ? 'animate-anti-gravity' : 'animate-anti-gravity-stagger'} hover:[animation-play-state:paused]`}
                  >
                    <ProductCard product={product} lightBg={true} isSpringCollection={true} />
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Explore All CTA */}
        <div className="flex justify-center mt-10">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 border border-[#1A1A1A]/15 hover:border-[#1A1A1A] text-[#1A1A1A] font-jost text-xs uppercase tracking-[0.2em] px-12 py-5 transition-all duration-300 bg-transparent hover:bg-[#1A1A1A] hover:text-white"
          >
            <span>Explore All Pieces</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
