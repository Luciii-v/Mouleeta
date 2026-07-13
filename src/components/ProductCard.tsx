'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useMemoryStore } from '@/store/useMemoryStore';
import { ShoppingBag, Pin } from 'lucide-react';
import WishlistButton from '@/components/WishlistButton';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

interface ProductCardProps {
  product: any;
  lightBg?: boolean;
}

const LOCAL_PRODUCT_COLORS: Record<string, string[]> = {
  'collar-dress': ['Blue', 'Pink'],
  'backless-top': ['Blue', 'Pink'],
  'backless-dress': ['Blue', 'Pink'],
  'slit-dress': ['Blue', 'Pink'],
  'short-dress': ['Blue', 'Pink'],
  'blue-bag': ['Blue', 'Pink'],
  'pink-bag': ['Blue', 'Pink'],
  'bag': ['Blue', 'Pink'],
  'tie-n-dye': ['Pink', 'Green'],
  'co-ord-sets': ['Blue', 'Pink']
};

const LOCAL_PRODUCT_SIZES: Record<string, string[]> = {
  'collar-dress': ['S', 'M', 'L'],
  'backless-top': ['S', 'M', 'L'],
  'backless-dress': ['S', 'M', 'L']
};

export default function ProductCard({ product, lightBg = true }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const addRecentItem = useMemoryStore((state) => state.addRecentItem);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Extract variant options
  const allVariants = product.variants?.edges.map(({ node }: any) => node) || [];
  
  const getOptionValue = (variant: any, name: string) => {
    return variant.selectedOptions?.find(
      (opt: any) => opt.name.toLowerCase() === name.toLowerCase()
    )?.value || '';
  };

  // Check if Shopify has real variants
  const hasShopifyVariants = allVariants.length > 1 || (allVariants[0] && allVariants[0].title !== 'Default Title');

  // Find unique color and size options
  const allColors = (hasShopifyVariants 
    ? Array.from(new Set(allVariants.map((v: any) => getOptionValue(v, 'color')).filter(Boolean)))
    : (LOCAL_PRODUCT_COLORS[product.handle] || [])) as string[];

  const allSizes = (hasShopifyVariants 
    ? Array.from(new Set(allVariants.map((v: any) => getOptionValue(v, 'size')).filter(Boolean)))
    : (LOCAL_PRODUCT_SIZES[product.handle] || [])) as string[];

  // Selected State on Card
  const [selectedColor, setSelectedColor] = useState<string>(allColors[0] || '');
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const rawImages = (product.images?.edges 
    ? product.images.edges.map((e: any) => e.node.url) 
    : [product.featuredImage?.url || '/placeholder.png']) as string[];

  // Group images by selected color
  const getImagesForColor = (color: string) => {
    const colorLower = color.toLowerCase();
    
    // First, try to see if the URL actually contains the color name (e.g., 'green' or 'pink')
    const explicitMatches = rawImages.filter(url => url.toLowerCase().includes(colorLower));
    if (explicitMatches.length > 0) return explicitMatches;

    // Fallback for mock data where only 'pink' is labeled in the URL and the rest are the alternate color
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
  const secondaryImage = colorImages[1] || undefined;

  const price = product.priceRange?.minVariantPrice 
    ? Math.round(parseFloat(product.priceRange.minVariantPrice.amount)) 
    : 0;

  const firstSentence = product.description?.split('.')[0] || 'Luxury Linen Piece';

  const handleQuickAdd = (size: string) => {
    let variantId = product.variants?.edges?.[0]?.node?.id || product.id;
    
    if (hasShopifyVariants) {
      const match = allVariants.find(
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



  // Memory Dock auto-add removed (Manual-Only)

  return (
    <motion.div 
      ref={cardRef}
      style={{ rotateX, scale, opacity, filter, zIndex }}
      className="flex flex-col group relative select-none transform-style-3d"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wishlist and Pin overlay */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        <WishlistButton item={{
          id: product.id,
          handle: product.handle,
          title: product.title,
          price: price,
          image: primaryImage,
          subtext: firstSentence
        }} />
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
          className="w-8 h-8 rounded-full bg-[#FAF9F6]/80 backdrop-blur-md flex items-center justify-center text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAF9F6] transition-all shadow-sm opacity-0 group-hover:opacity-100 cursor-pointer"
          title="Pin to Memory Dock"
        >
          <Pin size={14} />
        </button>
      </div>

      {/* Cinematic Frame with Living Flipbook */}
      <div className={`relative aspect-[3/4] overflow-hidden border ${borderThemeClass} transition-colors duration-500 group/frame`}>
        <Link href={`/products/${product.handle}`} className="block w-full h-full relative pointer-events-auto">
              <Image
                src={primaryImage}
                alt={`${product.title}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 pointer-events-none"
              />
        </Link>



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
            <p className={`font-inter text-[11px] mt-1 tracking-wide ${subtitleThemeClass}`}>
              {firstSentence}
            </p>
          </div>
          <span className={`font-inter text-[13px] font-bold ${textThemeClass}`}>
            ₹{price.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Color swatches displayed on the grid card (Hidden on hover if Quick Size active) */}
        {allColors.length > 1 && (
          <div className={`flex gap-1.5 mt-3 transition-opacity duration-300 ${isHovered && allSizes.length > 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {allColors.map((color) => {
              const isSelected = selectedColor === color;
              const swatchColor = color.toLowerCase() === 'white' ? '#FFFFFF' : color.toLowerCase() === 'black' ? '#1A1A1A' : color.toLowerCase() === 'blue' ? 'navy' : color.toLowerCase();
              return (
                <button
                  key={color}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setSelectedColor(color);
                  }}
                  className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 relative cursor-pointer ${
                    isSelected 
                      ? 'border-[#1A1A1A] scale-110 shadow-xs ring-1 ring-stone-900/10' 
                      : 'border-onyx/15 hover:border-[#1A1A1A] hover:scale-105'
                  }`}
                  title={color}
                >
                  <span 
                    className="absolute inset-[1px] rounded-full border border-black/5" 
                    style={{ backgroundColor: swatchColor }}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
