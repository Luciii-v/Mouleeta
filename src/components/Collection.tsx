'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';

interface CollectionProps {
  products: any[];
}

export default function Collection({ products }: CollectionProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const itemsPerPage = isDesktop ? 3 : 1;
  const maxIndex = Math.max(0, products.length - itemsPerPage);

  // Auto-swipe every 4 seconds
  useEffect(() => {
    if (products.length <= itemsPerPage) return;
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1 > maxIndex ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [products.length, itemsPerPage, maxIndex]);

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 < 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1 > maxIndex ? 0 : prev + 1));
  };

  const translatePercent = isDesktop ? (startIndex * 100 / 3) : (startIndex * 100);

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
          
          {/* Navigation Arrows */}
          {products.length > itemsPerPage && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#FAF9F6]/90 border border-onyx/5 flex items-center justify-center text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-md cursor-pointer -translate-x-2 md:-translate-x-4"
                aria-label="Previous products"
              >
                <ChevronLeft size={20} strokeWidth={1.5} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#FAF9F6]/90 border border-onyx/5 flex items-center justify-center text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-md cursor-pointer translate-x-2 md:translate-x-4"
                aria-label="Next products"
              >
                <ChevronRight size={20} strokeWidth={1.5} />
              </button>
            </>
          )}

          {/* Sliding motion track */}
          <div className="overflow-hidden w-full">
            <motion.div
              className="flex"
              animate={{ x: `-${translatePercent}%` }}
              transition={{ type: 'spring', stiffness: 70, damping: 18 }}
            >
              {products.map((productEdge) => {
                const product = productEdge.node;
                return (
                  <div
                    key={product.id}
                    className="w-full md:w-1/3 flex-shrink-0 px-4"
                  >
                    <ProductCard product={product} lightBg={true} />
                  </div>
                );
              })}
            </motion.div>
          </div>

        </div>

        {/* Explore All CTA */}
        <div className="flex justify-center mt-20">
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
