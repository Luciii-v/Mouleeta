'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import WishlistButton from '@/components/WishlistButton';

interface CarouselProduct {
  id?: string;
  title?: string;
  handle?: string;
  slug?: string;
  description?: string;
  price?: number;
  tags?: string[];
  featuredImage?: { url: string };
  images?: string[] | { edges?: Array<{ node: { url: string } }> };
  priceRange?: { minVariantPrice?: { amount: string | number; currencyCode?: string } };
  variants?: Array<{ id: string }> | { edges?: Array<{ node: { id: string } }> };
  node?: CarouselProduct;
}

interface ProductCarouselProps {
  products: CarouselProduct[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    
    // Calculate the precise center coordinate of the scroll container's visible area
    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    
    let minDistance = Infinity;
    let closestIndex = 0;
    
    // Convert children (the cards) to an array
    const children = Array.from(container.children);
    
    children.forEach((child, index) => {
      const htmlChild = child as HTMLElement;
      // Find the center of this specific card
      const childCenter = htmlChild.offsetLeft + htmlChild.offsetWidth / 2;
      const distance = Math.abs(childCenter - containerCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    
    setActiveIndex((prev) => (closestIndex !== prev ? closestIndex : prev));
  }, []);

  useEffect(() => {
    // Run once on mount to establish the active card accurately
    if (carouselRef.current) {
      handleScroll();
    }
  }, [products, handleScroll]);

  const scrollTo = (index: number) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const child = container.children[index] as HTMLElement;
    if (child) {
      // Math to perfectly snap the target child to the absolute center
      const scrollLeft = child.offsetLeft - container.offsetWidth / 2 + child.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => scrollTo(Math.max(0, activeIndex - 1));
  const scrollRight = () => scrollTo(Math.min(products.length - 1, activeIndex + 1));

  if (!products || products.length === 0) return null;

  return (
    <div className="relative w-full group/carousel py-16 overflow-hidden">
      
      {/* Desktop Navigation Arrows */}
      <button 
        onClick={scrollLeft}
        disabled={activeIndex === 0}
        aria-label="Previous product"
        className={`absolute left-4 md:left-12 top-[45%] -translate-y-1/2 z-40 bg-white/90 backdrop-blur-md p-3 md:p-4 rounded-full transition-all duration-300 shadow-lg ${activeIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-0 md:group-hover/carousel:opacity-100 hover:bg-white hover:scale-110'}`}
      >
        <ChevronLeft size={24} className="text-[#1A1A1A]" />
      </button>
      
      <button 
        onClick={scrollRight}
        disabled={activeIndex === products.length - 1}
        aria-label="Next product"
        className={`absolute right-4 md:right-12 top-[45%] -translate-y-1/2 z-40 bg-white/90 backdrop-blur-md p-3 md:p-4 rounded-full transition-all duration-300 shadow-lg ${activeIndex === products.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-0 md:group-hover/carousel:opacity-100 hover:bg-white hover:scale-110'}`}
      >
        <ChevronRight size={24} className="text-[#1A1A1A]" />
      </button>

      {/* Cinematic Horizontal Scroll Track */}
      <div 
        ref={carouselRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto px-[10vw] md:px-[calc(50vw-200px)] py-12 gap-4 md:gap-8 snap-x snap-mandatory hide-scrollbar w-full"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((edge: CarouselProduct, index: number) => {
          const product = edge.node || edge;
          
          const images = Array.isArray(product.images) ? product.images : (product.images?.edges ? product.images.edges.map((e: { node: { url: string } }) => e.node.url) : []);
          const primaryImage = images[0] || product.featuredImage?.url || '/images/placeholder.jpg';
          const secondaryImage = images[1] || primaryImage;
          
          const priceObj = product.priceRange?.minVariantPrice || { amount: product.price || 0, currencyCode: 'INR' };
          const numericPrice = typeof priceObj.amount === 'string' ? parseFloat(priceObj.amount) : priceObj.amount;
          const firstSentence = product.description?.split('.')[0] || 'Luxury Collection Piece';

          // Cinematic distance math
          const distance = Math.abs(index - activeIndex);
          const isActive = distance === 0;
          const isAdjacent = distance === 1;
          
          let scale = 0.7;
          let opacity = 0.35;
          let blur = "blur(4px)";
          
          if (isActive) {
            scale = 1.0;
            opacity = 1;
            blur = "blur(0px)";
          } else if (isAdjacent) {
            scale = 0.85;
            opacity = 0.6;
            blur = "blur(1px)";
          }

          return (
            <div
              key={product.id || `product-${index}`}
              onClick={() => !isActive && scrollTo(index)}
              className={`flex-none w-[80vw] md:w-[400px] snap-center will-change-transform ${isActive ? '' : 'cursor-pointer'}`}
              style={{
                transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                transform: `scale(${scale})`,
                opacity: opacity,
                filter: blur,
                zIndex: isActive ? 10 : 5 - distance
              }}
            >
              {/* Product Image Frame */}
              <div className={`relative aspect-[2/3] bg-[#F5EFE7] overflow-hidden group select-none transition-shadow duration-500 ${isActive ? 'shadow-2xl' : 'shadow-none'}`}>
                {isActive && (
                  <div className="absolute top-4 right-4 z-30">
                    <WishlistButton item={{
                      id: product.id || `prod-${index}`,
                      handle: product.handle || product.slug || 'item',
                      title: product.title || 'Luxury Item',
                      price: numericPrice,
                      image: primaryImage,
                      subtext: firstSentence
                    }} />
                  </div>
                )}
                {/* Primary Image */}
                <Image
                  src={primaryImage}
                  alt={product.title || 'Product Image'}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={`object-cover transition-transform duration-700 ease-out ${isActive ? 'group-hover:scale-105' : ''}`}
                  draggable={false}
                />

                {/* Secondary Image Hover Reveal */}
                {secondaryImage !== primaryImage && isActive && (
                  <Image
                    src={secondaryImage}
                    alt={`${product.title || 'Product'} Alternate`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover absolute inset-0 transition-opacity duration-700 ease-out opacity-0 group-hover:opacity-100"
                    draggable={false}
                  />
                )}

                {/* Cinematic Hover Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-700 ease-out pointer-events-none z-10 ${isActive ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`} />

                {/* Add To Cart Hover Button */}
                {isActive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      addToCart({
                        id: product.id || `prod-${index}`,
                        variantId: (Array.isArray(product.variants) ? product.variants[0]?.id : product.variants?.edges?.[0]?.node?.id) || product.id || `prod-${index}`,
                        title: product.title || 'Luxury Item',
                        subtext: firstSentence,
                        price: numericPrice,
                        image: primaryImage,
                        size: 'OS'
                      });
                    }}
                    className="absolute bottom-0 left-0 w-full bg-[#1A1A1A] text-[#FDFBF7] text-[11px] font-light uppercase tracking-[0.2em] py-4 transition-all duration-300 opacity-0 group-hover:opacity-100 text-center flex items-center justify-center gap-2 z-20"
                  >
                    <ShoppingBag size={14} strokeWidth={2} />
                    Add To Cart
                  </button>
                )}
              </div>

              {/* Product Typography & Price */}
              <div className={`mt-6 flex flex-col items-center text-center transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                <span className="font-metropolis text-[10px] tracking-[0.2em] text-[#1A1A1A]/50 uppercase mb-2">
                  {product.tags?.[0] || 'COLLECTION'}
                </span>
                <Link href={`/products/${product.handle || product.slug}`} onClick={(e) => !isActive && e.preventDefault()}>
                  <h3 className="font-jost font-light text-[14px] md:text-[15px] uppercase tracking-[0.2em] text-[#1A1A1A] leading-relaxed mb-1 hover:text-[#1A1A1A]/60 transition-colors">
                    {product.title || 'Untitled Piece'}
                  </h3>
                </Link>
                <span className="font-inter text-[13px] font-medium text-[#1A1A1A] mt-1">
                  ₹{numericPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Dot Indicators */}
      <div className="flex justify-center gap-2 mt-2">
        {products.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className={`transition-all duration-300 rounded-full ${idx === activeIndex ? 'w-8 h-1.5 bg-[#1A1A1A]' : 'w-1.5 h-1.5 bg-[#1A1A1A]/20 hover:bg-[#1A1A1A]/40'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
