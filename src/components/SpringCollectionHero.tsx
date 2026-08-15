'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface SpringCollectionHeroProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: any[];
}

// Sub-component for the Product Card
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SpringProductCard({ product, index }: { product: any; index: number }) {
  // Extract images handling both potential data structures (e.g., Shopify edges or flat array)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const images = product.images?.edges?.map((e: any) => e.node.url) || 
                 (Array.isArray(product.images) ? product.images : [product.featuredImage?.url || '/placeholder.png']);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      nextImage();
    }, 2500); // Auto-swipe every 2.5 seconds
  }, [nextImage]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
  }, []);

  const handleManualSwipe = (direction: 'next' | 'prev', e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (direction === 'next') {
      nextImage();
    } else {
      prevImage();
    }

    // Pause autoplay for 2 seconds on manual swipe, then resume if not hovered
    stopAutoPlay();
    pauseTimeoutRef.current = setTimeout(() => {
      if (!isHovered) {
        startAutoPlay();
      }
    }, 2000);
  };

  useEffect(() => {
    if (images.length > 1 && !isHovered) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
    return () => stopAutoPlay();
  }, [images.length, isHovered, startAutoPlay, stopAutoPlay]);

  // Extract price
  const price = product.priceRange?.minVariantPrice?.amount || product.price || 0;

  return (
    <div 
      className={`group relative flex flex-col ${index % 2 !== 0 ? 'animate-anti-gravity-stagger' : 'animate-anti-gravity'} hover:[animation-play-state:paused]`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        // Ensure autoplay resumes when mouse leaves, clearing any manual pause delays
        if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      }}
    >
      <Link href={`/products/${product.handle || product.id}`} className="block relative aspect-[3/4] w-full overflow-hidden bg-[#ebe4d8]">
        <Image
          src={images[currentImageIndex]}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
        />
        
        {/* Left Arrow */}
        {images.length > 1 && (
          <button 
            onClick={(e) => handleManualSwipe('prev', e)}
            onTouchEnd={(e) => handleManualSwipe('prev', e)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white cursor-pointer shadow-sm"
          >
            <ChevronLeft size={16} className="text-[#1A1A1A]" />
          </button>
        )}

        {/* Right Arrow */}
        {images.length > 1 && (
          <button 
            onClick={(e) => handleManualSwipe('next', e)}
            onTouchEnd={(e) => handleManualSwipe('next', e)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white cursor-pointer shadow-sm"
          >
            <ChevronRight size={16} className="text-[#1A1A1A]" />
          </button>
        )}
      </Link>
      
      <div className="mt-4 flex flex-col gap-1 px-1">
        <h3 className="font-jost text-[12px] uppercase tracking-[0.25em] text-[#1A1A1A]">{product.title}</h3>
        <p className="font-inter text-[13px] font-bold text-[#1A1A1A]">₹{Number(price).toLocaleString('en-IN')}</p>
      </div>
    </div>
  );
}

export default function SpringCollectionHero({ products = [] }: SpringCollectionHeroProps) {
  // Strict Routing & Data Filtering Requirement:
  // Filter for summer/spring collection
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const summerProducts = products.map(p => p.node || p).filter((product: any) => {
    // Modify this logic based on your exact tag/category structure.
    const tags = product.tags || [];
    return tags.some((tag: string) => tag.toLowerCase().includes('summer') || tag.toLowerCase().includes('spring'));
  });

  // If no summer products found, fallback to showing first 4 products for demonstration
  const displayProducts = summerProducts.length > 0 ? summerProducts : products.map(p => p.node || p);

  if (displayProducts.length === 0) return null;

  return (
    <section className="w-full py-24 px-4 md:px-8 bg-[#f6f1e8]">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="flex flex-col items-center mb-16">
          <span className="font-jost text-xs uppercase tracking-[0.3em] text-[#7E7577] mb-3">New Arrivals</span>
          <h2 className="font-editorial text-4xl md:text-5xl text-center text-[#231f20]">The Spring Collection</h2>
        </div>
        
        {/* Render only 4 products to isolate the view and not overwhelm the layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-10 w-full">
          {displayProducts.slice(0, 4).map((product, idx) => (
            <SpringProductCard key={product.id || idx} product={product} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
