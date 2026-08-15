'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useMemoryStore } from '@/store/useMemoryStore';
import { Pin } from 'lucide-react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import WishlistButton from '@/components/WishlistButton';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

interface ProductCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
  lightBg?: boolean;
  isSpringCollection?: boolean;
}

const LOCAL_PRODUCT_COLORS: Record<string, string[]> = {
  'collar-dress': ['Midnight Blue', 'Pink'],
  'backless-top': ['Midnight Blue', 'Pink'],
  'backless-dress': ['Midnight Blue', 'Pink'],
  'slit-dress': ['Midnight Blue', 'Pink'],
  'short-dress': ['Midnight Blue', 'Pink'],
  'blue-bag': ['Midnight Blue', 'Pink'],
  'pink-bag': ['Midnight Blue', 'Pink'],
  'bag': ['Midnight Blue', 'Pink'],
  'tie-n-dye': ['Pink', 'Green'],
  'co-ord-sets': ['Midnight Blue', 'Pink']
};

const LOCAL_PRODUCT_SIZES: Record<string, string[]> = {
  'collar-dress': ['S', 'M', 'L'],
  'backless-top': ['S', 'M', 'L'],
  'backless-dress': ['S', 'M', 'L']
};

export default function SandboxProductCard({ product, lightBg = true, isSpringCollection = false }: ProductCardProps) {
  const { status } = useSession();
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const addRecentItem = useMemoryStore((state) => state.addRecentItem);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allVariants = product.variants?.edges.map(({ node }: any) => node) || [];
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getOptionValue = (variant: any, name: string) => {
    return variant.selectedOptions?.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (opt: any) => opt.name.toLowerCase() === name.toLowerCase()
    )?.value || '';
  };

  const hasShopifyVariants = allVariants.length > 1 || (allVariants[0] && allVariants[0].title !== 'Default Title');

  const allColors = ((hasShopifyVariants 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? Array.from(new Set(allVariants.map((v: any) => getOptionValue(v, 'color')).filter(Boolean)))
    : (LOCAL_PRODUCT_COLORS[product.handle] || [])) as string[]).filter(c => c.toLowerCase() !== 'dots');

  const allSizes = (hasShopifyVariants 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? Array.from(new Set(allVariants.map((v: any) => getOptionValue(v, 'size')).filter(Boolean)))
    : (LOCAL_PRODUCT_SIZES[product.handle] || [])) as string[];

  const [selectedColor, setSelectedColor] = useState<string>(allColors[0] || '');
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const rawImages = (product.images?.edges 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? product.images.edges.map((e: any) => e.node.url) 
    : [product.featuredImage?.url || '/placeholder.png']) as string[];

  const getImagesForColor = (color: string) => {
    const colorLower = color.toLowerCase();
    const explicitMatches = rawImages.filter(url => url.toLowerCase().includes(colorLower));
    if (explicitMatches.length > 0) return explicitMatches;

    if (colorLower === 'pink') {
      const pinkImages = rawImages.filter(url => url.toLowerCase().includes('pink'));
      return pinkImages.length > 0 ? pinkImages : rawImages;
    } else {
      const nonPinkImages = rawImages.filter(url => !url.toLowerCase().includes('pink'));
      return nonPinkImages.length > 0 ? nonPinkImages : rawImages;
    }
  };

  const colorImages = allColors.length > 0 ? getImagesForColor(selectedColor) : rawImages;
  const primaryImage = colorImages[0] || rawImages[0] || '/placeholder.png';

  const price = product.priceRange?.minVariantPrice 
    ? Math.round(parseFloat(product.priceRange.minVariantPrice.amount)) 
    : 0;

  const rawDesc = product.description || '';
  const cleanDesc = rawDesc
    .replace(/Description\s*:/i, '')
    .replace(/^[A-Z][a-zA-Z\s&]*(Dress|Top|Set|Sets|Shirt|Blouse|Skirt|Pant|Pants|Trouser|Trousers|Kurta|Saree|Jumpsuit|Co-ord|Suit)\s+/i, '')
    .replace(/^[\s–—,.\xa0]+/, '')
    .trim();

  const firstSentence = cleanDesc ? cleanDesc.split('.')[0] : 'Luxury Linen Piece';

  const handleQuickAdd = (size: string) => {
    if (status !== "authenticated") {
      router.push("/account/login");
      return;
    }

    let variantId = product.variants?.edges?.[0]?.node?.id || product.id;
    
    if (hasShopifyVariants) {
      const match = allVariants.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (v: any) => getOptionValue(v, 'color') === selectedColor && getOptionValue(v, 'size') === size
      );
      if (match) {
        variantId = match.id;
      }
    }

    addToCart({
      id: product.id,
      variantId,
      title: product.title,
      subtext: firstSentence,
      price,
      image: primaryImage,
      size: allColors.length > 0 && allSizes.length > 0 
        ? `${selectedColor} / ${size}` 
        : size,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const textThemeClass = lightBg ? 'text-[#1A1A1A]' : 'text-white';
  const subtitleThemeClass = lightBg ? 'text-[#1A1A1A]/60' : 'text-neutral-400';
  const borderThemeClass = lightBg ? 'border-onyx/5 bg-[#F5EFE7]/80' : 'border-neutral-900 bg-neutral-950';

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Runway Effect: Tilt, shrink, blur at edges. Snap flat in center.
  const rotateX = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [15, 0, 0, 15]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
  const blurVal = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [2, 0, 0, 2]);
  const filter = useTransform(blurVal, (val) => `blur(${val}px)`);
  const zIndex = useTransform(scrollYProgress, [0, 0.5, 1], [0, 10, 0]);

  // Image Carousel Logic
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % rawImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + rawImages.length) % rawImages.length);
  };

  const handleManualSwipe = (direction: 'next' | 'prev', e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (direction === 'next') {
      nextImage();
    } else {
      prevImage();
    }
  };



  // Memory Dock auto-add removed (Manual-Only)

  return (
    <motion.div 
      ref={cardRef}
      style={{ rotateX, scale, opacity, filter, zIndex }}
      className="flex flex-col group relative select-none transform-style-3d"
      onMouseEnter={() => {
        setIsHovered(true);
        if (rawImages.length > 1) {
          setCurrentImageIndex(1);
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        <WishlistButton item={{
          id: product.id,
          handle: product.handle,
          title: product.title,
          price: price,
          image: primaryImage,
          subtext: firstSentence
        }}
        className="w-[34px] h-[34px] flex items-center justify-center !p-0"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addRecentItem({
              id: product.id,
              handle: product.handle,
              title: product.title,
              image: primaryImage,
              price
            });
          }}
          className="group w-[34px] h-[34px] rounded-full bg-white/85 hover:bg-white backdrop-blur-sm border border-black/5 flex items-center justify-center text-stone-800 hover:scale-110 active:scale-95 transition-all duration-300 shadow-sm cursor-pointer"
          title="Pin to Memory Dock"
        >
          <Pin size={18} className="transition-colors duration-300 group-hover:text-black" />
        </button>
      </div>

      {/* Cinematic Frame with Living Flipbook */}
      <div className={`relative aspect-[3/4] overflow-hidden border ${borderThemeClass} transition-colors duration-500 group/frame`}>
        {/* Monochromatic Skeleton/Loading Background */}
        <div className="absolute inset-0 bg-[#F6F1E8] z-0" />
        
        <Link href={`/products/${product.handle}`} className="block w-full h-full relative pointer-events-auto z-10">
              <Image
                src={rawImages.length > 1 ? rawImages[currentImageIndex] : primaryImage}
                alt={`${product.title}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                onLoad={() => setIsLoaded(true)}
                className={`object-cover transform-gpu pointer-events-none ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                } transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105`}
              />
        </Link>
        
        {/* Left Arrow (Only for Spring Collection) */}
        {isSpringCollection && rawImages.length > 1 && (
          <button 
            onClick={(e) => handleManualSwipe('prev', e)}
            onTouchEnd={(e) => handleManualSwipe('prev', e)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hover:bg-white cursor-pointer shadow-sm"
          >
            <ChevronLeft size={16} className="text-[#1A1A1A]" />
          </button>
        )}

        {/* Right Arrow (Only for Spring Collection) */}
        {isSpringCollection && rawImages.length > 1 && (
          <button 
            onClick={(e) => handleManualSwipe('next', e)}
            onTouchEnd={(e) => handleManualSwipe('next', e)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hover:bg-white cursor-pointer shadow-sm"
          >
            <ChevronRight size={16} className="text-[#1A1A1A]" />
          </button>
        )}



        {/* Luxury vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Slide-up Quick Add Sizes Drawer */}
        <AnimatePresence>
          {isHovered && allSizes.length > 0 && (
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute bottom-0 left-0 w-full bg-[#1A1A1A]/95 backdrop-blur-xs py-3 px-4 flex flex-col items-center gap-2 z-10"
            >
              <span className="font-metropolis text-[9px] uppercase tracking-[0.2em] text-[#FDFBF7]/60">
                {isAdded ? 'Added to Bag!' : 'Quick Add Size'}
              </span>
              <div className="flex gap-4">
                {allSizes.map((size) => (
                  <button
                    key={size}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleQuickAdd(size);
                    }}
                    className="font-metropolis text-xs font-semibold text-[#FDFBF7] hover:text-[#1A1A1A] hover:bg-[#FDFBF7] w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 shadow-none cursor-pointer"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info block */}
      <div className="mt-4 flex flex-col items-start w-full px-1">
        <div className="flex justify-between items-start w-full">
          <div>
            <Link href={`/products/${product.handle}`} className={`hover:opacity-75 transition-opacity`}>
              <h3 className={`font-jost font-light text-[12px] uppercase tracking-[0.25em] ${textThemeClass}`}>
                {product.title}
              </h3>
            </Link>
          </div>
          <span className={`font-inter text-[13px] font-bold ${textThemeClass}`}>
            ₹{price.toLocaleString('en-IN')}
          </span>
        </div>


      </div>
    </motion.div>
  );
}
