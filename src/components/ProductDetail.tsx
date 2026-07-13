'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, ArrowLeft, Truck, ChevronDown, ChevronUp, Leaf } from 'lucide-react';
import Link from 'next/link';
import MagneticButton from '@/components/MagneticButton';
import WishlistButton from '@/components/WishlistButton';
import FitConciergeModal from '@/components/FitConciergeModal';
import StyledWith from '@/components/StyledWith';
import VIPConcierge from '@/components/VIPConcierge';
import RecentlyViewed from '@/components/RecentlyViewed';

interface VariantNode {
  id: string;
  title: string;
  availableForSale: boolean;
  price?: {
    amount: string;
    currencyCode: string;
  };
  priceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  sku?: string;
  selectedOptions?: Array<{
    name: string;
    value: string;
  }>;
  image?: {
    url: string;
    altText?: string;
  };
}

interface ProductDetailProps {
  allProducts?: any[];
  product: {
    id: string;
    handle: string;
    title: string;
    descriptionHtml: string;
    description?: string;
    productType?: string;
    vendor?: string;
    tags?: string[];
    images: {
      edges: {
        node: {
          url: string;
          altText?: string;
        }
      }[]
    };
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    variants: {
      edges: {
        node: VariantNode;
      }[];
    };
  };
}

export default function ProductDetail({ product, allProducts }: ProductDetailProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<VariantNode>(
    product.variants.edges.find(({ node }) => node.availableForSale)?.node || product.variants.edges[0]?.node
  );
  
  // Extract variant options
  const allVariants = product.variants.edges.map(({ node }) => node);
  
  const getOptionValue = (variant: VariantNode, name: string) => {
    return variant.selectedOptions?.find(
      (opt) => opt.name.toLowerCase() === name.toLowerCase()
    )?.value || '';
  };

  // Local config for active products if Shopify variants are missing
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

  // Check if Shopify has real variants
  const hasShopifyVariants = allVariants.length > 1 || (allVariants[0] && allVariants[0].title !== 'Default Title');

  // Find all unique color and size option values
  const allColors = hasShopifyVariants 
    ? Array.from(new Set(allVariants.map(v => getOptionValue(v, 'color')).filter(Boolean)))
    : (LOCAL_PRODUCT_COLORS[product.handle] || []);

  const allSizes = hasShopifyVariants 
    ? Array.from(new Set(allVariants.map(v => getOptionValue(v, 'size')).filter(Boolean)))
    : (LOCAL_PRODUCT_SIZES[product.handle] || []);

  // Selected Color and Size state
  const [selectedColor, setSelectedColor] = useState<string>(() => {
    if (hasShopifyVariants) {
      return getOptionValue(selectedVariant, 'color') || allColors[0] || '';
    }
    return allColors[0] || '';
  });

  const [selectedSize, setSelectedSize] = useState<string>(() => {
    if (hasShopifyVariants) {
      return getOptionValue(selectedVariant, 'size') || allSizes[0] || '';
    }
    return allSizes[0] || '';
  });

  const [showSizeWarning, setShowSizeWarning] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  
  const handleColorSelect = (colorValue: string) => {
    setSelectedColor(colorValue);
    
    if (hasShopifyVariants) {
      // Find matching variant with same size
      let match = allVariants.find(
        (v) => getOptionValue(v, 'color') === colorValue && getOptionValue(v, 'size') === selectedSize
      );
      
      // Fallback: first available size in this color
      if (!match) {
        match = allVariants.find(
          (v) => getOptionValue(v, 'color') === colorValue && v.availableForSale
        ) || allVariants.find(
          (v) => getOptionValue(v, 'color') === colorValue
        );
      }
      
      if (match) {
        setSelectedVariant(match);
        const matchedSize = getOptionValue(match, 'size');
        if (matchedSize) {
          setSelectedSize(matchedSize);
        }
      }
    }
    setActiveImageIndex(0);
    setShowSizeWarning(false);
  };

  const handleSizeSelect = (sizeValue: string) => {
    setSelectedSize(sizeValue);
    
    if (hasShopifyVariants) {
      const match = allVariants.find(
        (v) => getOptionValue(v, 'color') === selectedColor && getOptionValue(v, 'size') === sizeValue
      );
      if (match) {
        setSelectedVariant(match);
      }
    }
    setShowSizeWarning(false);
  };
  
  // Texture Zoom State
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);

  // Accordion States
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Derive simple fallback properties if pure Shopify structure is missing fields
  const firstSentence = product.description 
    ? product.description.split('.')[0] 
    : 'Luxury Collection Piece';
    
  const rawImages = product.images?.edges ? product.images.edges.map(e => e.node.url) : [];
  
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

  const images = (allColors.length > 0 ? getImagesForColor(selectedColor) : rawImages).length > 0
    ? getImagesForColor(selectedColor)
    : rawImages;

  const primaryImage = images[0] || '/placeholder.png';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleZoomEnter = () => {
    setIsZooming(window.innerWidth >= 1024);
  };

  const handleAddToBag = () => {
    if (!selectedVariant) {
      setShowSizeWarning(true);
      return;
    }
    setShowSizeWarning(false);

    const price = selectedVariant?.price?.amount 
      || selectedVariant?.priceRange?.minVariantPrice?.amount 
      || product.priceRange.minVariantPrice.amount;

    addToCart({
      id: product.id,
      variantId: selectedVariant.id,
      title: product.title,
      subtext: firstSentence,
      price: parseFloat(price),
      image: primaryImage,
      size: !hasShopifyVariants && allColors.length > 0
        ? `${selectedColor} / ${selectedSize}`
        : (allSizes.length > 0 ? selectedSize : selectedVariant.title),
    });
  };

  const variantPrice = selectedVariant?.price?.amount 
    || selectedVariant?.priceRange?.minVariantPrice?.amount 
    || product.priceRange.minVariantPrice.amount;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(parseFloat(variantPrice));

  const numericPrice = parseFloat(variantPrice);

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-12 md:py-24 flex flex-col gap-12 md:gap-16">
      {/* Breadcrumb / Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/`}
          className="group flex items-center gap-2 font-metropolis text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Back to Collection
        </Link>
        <span className="font-metropolis text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-[#1A1A1A]/40 hidden sm:block">
          Mouleeta Couture &nbsp;/&nbsp; SKU: {selectedVariant?.sku || 'MOU-COL'}
        </span>
      </div>

      {/* 2-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Image Gallery (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 items-start select-none">
          
          {/* Thumbnails list */}
          {images.length > 1 && (
            <div className="flex md:flex-col gap-3 w-full md:w-20 overflow-x-auto md:overflow-x-visible no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative flex-none w-16 h-20 md:w-full aspect-[3/4] bg-[#F5EFE7]/80 border transition-all duration-300 ${
                    idx === activeImageIndex 
                      ? 'border-[#1A1A1A] scale-[1.02] opacity-100' 
                      : 'border-onyx/5 opacity-60 hover:opacity-100'
                  } overflow-hidden rounded-none cursor-pointer`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} view ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Large Main Image Frame with Texture Zoom */}
          <div 
            className="flex-1 w-full aspect-[3/4] bg-[#F5EFE7]/80 border border-onyx/5 overflow-hidden relative cursor-crosshair lg:cursor-zoom-in"
            onMouseEnter={handleZoomEnter}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImageIndex}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: isZooming ? 2.5 : 1,
                  transformOrigin: isZooming ? `${zoomPos.x}% ${zoomPos.y}%` : '50% 50%'
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  opacity: { duration: 0.4 }, 
                  scale: { duration: 0.3, ease: "easeOut" },
                  transformOrigin: { duration: 0 } // instant tracking
                }}
                className="w-full h-full relative"
              >
                <Image
                  src={images[activeImageIndex] || primaryImage}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  priority
                  className="object-cover"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Product Details (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col items-start w-full sticky top-32">
          
          {/* Tag & Category Breadcrumb */}
          <span className="font-metropolis text-[10px] tracking-[0.25em] uppercase text-[#1A1A1A]/50 mb-3">
            {product.productType || 'Apparel'} &nbsp;·&nbsp; {product.vendor || 'Mouleeta'}
          </span>

          {/* Large Title */}
          <h1 className="font-jost font-light text-2xl sm:text-3xl md:text-[34px] tracking-[0.15em] text-[#1A1A1A] uppercase leading-tight mb-4">
            {product.title}
          </h1>

          {/* Price Tag */}
          <span className="font-inter text-xl font-bold text-[#1A1A1A] mb-8 block">
            {formattedPrice}
          </span>

          {/* Separation Divider */}
          <div className="w-full h-[1px] bg-onyx/10 mb-8" />

          {/* Long Description (HTML from Shopify) */}
          {product.descriptionHtml ? (
            <div 
              className="prose prose-sm prose-stone text-[13px] text-[#1A1A1A]/70 font-light leading-relaxed tracking-wide mb-8"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          ) : (
            <p className="font-inter text-xs sm:text-sm text-[#1A1A1A]/70 leading-relaxed tracking-wider mb-8">
              {firstSentence}
            </p>
          )}

          {/* Color Selector */}
          {allColors.length > 0 && (
            <div className="w-full mb-6">
              <span className="font-metropolis text-[10px] font-bold tracking-[0.18em] uppercase text-[#1A1A1A] block mb-3">
                Color: <span className="font-light text-neutral-500 capitalize">{selectedColor}</span>
              </span>
              <div className="flex flex-wrap gap-3">
                {allColors.map((color) => {
                  const isSelected = selectedColor === color;
                  // Color name mapping for custom swatch visuals (with ivory background fallback)
                  const swatchColor = color.toLowerCase() === 'white' ? '#FFFFFF' : color.toLowerCase() === 'black' ? '#1A1A1A' : color.toLowerCase() === 'blue' ? 'navy' : color.toLowerCase();
                  return (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      className={`w-8 h-8 rounded-full border transition-all duration-300 relative cursor-pointer ${
                        isSelected 
                          ? 'border-[#1A1A1A] scale-110 shadow-sm ring-2 ring-stone-900/10' 
                          : 'border-onyx/15 hover:border-[#1A1A1A] hover:scale-105'
                      }`}
                      title={color}
                    >
                      <span 
                        className="absolute inset-1 rounded-full border border-black/5" 
                        style={{ backgroundColor: swatchColor }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Variant Selector Header */}
          <div className="flex justify-between items-center w-full mb-4">
            <span className="font-metropolis text-[10px] font-bold tracking-[0.18em] uppercase text-[#1A1A1A]">
              Select Size
            </span>
            <button 
              onClick={() => setShowSizeGuide(true)}
              className="font-metropolis text-[9px] tracking-[0.15em] uppercase text-stone-600 hover:text-black transition-colors pb-0.5 border-none bg-transparent cursor-pointer flex items-center gap-1 font-semibold"
            >
              ✨ Find My Size & Fit Concierge
            </button>
          </div>

          {/* Size Boxes Grid */}
          <div className="flex flex-wrap gap-2 w-full mb-8">
            {(allSizes.length > 0 ? allSizes : product.variants.edges.map(({ node }) => node.title)).map((size) => {
              // Find variant matching active color and this size
              const matchedVar = allVariants.find(
                (v) => (allColors.length > 0 ? getOptionValue(v, 'color') === selectedColor : true) && 
                       (allSizes.length > 0 ? getOptionValue(v, 'size') === size : v.title === size)
              );
              
              const isSelected = allSizes.length > 0 ? selectedSize === size : selectedVariant?.title === size;
              const outOfStock = hasShopifyVariants
                ? (!matchedVar || !matchedVar.availableForSale)
                : !selectedVariant?.availableForSale;
              
              return (
                <button
                  key={size}
                  disabled={outOfStock}
                  onClick={() => handleSizeSelect(size)}
                  className={`min-w-[48px] h-12 px-3 flex items-center justify-center border font-metropolis text-xs tracking-wider transition-all duration-300 rounded-none cursor-pointer ${
                    outOfStock
                      ? 'border-onyx/5 text-[#1A1A1A]/20 cursor-not-allowed line-through bg-stone-100/50'
                      : isSelected
                      ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#FDFBF7]'
                      : 'border-onyx/15 hover:border-[#1A1A1A]/60 text-[#1A1A1A] bg-transparent'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>

          {/* Dynamic Warning Notification */}
          <AnimatePresence>
            {showSizeWarning && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-500 font-inter text-[11px] tracking-wide mb-4 uppercase"
              >
                Please select a size to proceed.
              </motion.p>
            )}
          </AnimatePresence>

          {/* ADD TO BAG & WISHLIST (Desktop Only) */}
          <div className="hidden md:flex items-center gap-3 mb-8">
            <div className="flex-1">
              <MagneticButton strength={20} className="w-full">
                <button
                  onClick={handleAddToBag}
                  disabled={!selectedVariant?.availableForSale}
                  className="w-full flex bg-[#1A1A1A] text-[#FDFBF7] font-metropolis font-light text-[11px] uppercase tracking-[0.25em] py-5 hover:bg-[#1A1A1A]/95 transition-all duration-300 rounded-none cursor-pointer border-none items-center justify-center gap-2.5 shadow-xs hover:-translate-y-1 hover:shadow-xl hover:bg-stone-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  <ShoppingBag size={14} strokeWidth={2} />
                  {selectedVariant?.availableForSale ? 'Add To Bag' : 'Out of Stock'}
                </button>
              </MagneticButton>
            </div>
            <WishlistButton 
              item={{
                id: product.id,
                handle: product.handle,
                title: product.title,
                price: numericPrice,
                image: product.images.edges[0]?.node?.url || '/placeholder.png',
                subtext: product.tags?.[0]
              }} 
              size={20}
              className="p-4 border border-stone-300 rounded-none hover:border-black bg-white hover:bg-stone-50"
            />
          </div>

          {/* VIP Personal Shopping WhatsApp Concierge */}
          <VIPConcierge productTitle={product.title} productHandle={product.handle} className="mb-8" />

          {/* Minimalist Trust Badges */}
          <div className="w-full flex items-center justify-between py-4 border-y border-onyx/10 mb-8">
            <span className="font-metropolis text-[9px] tracking-widest uppercase text-stone-500">100% Organic</span>
            <span className="font-metropolis text-[9px] tracking-widest uppercase text-stone-500">Ethically Made</span>
            <span className="font-metropolis text-[9px] tracking-widest uppercase text-stone-500">Zero Waste</span>
          </div>

          {/* Premium Details Accordions */}
          <div className="w-full border-t border-onyx/10 pt-4 flex flex-col select-none mb-8">

            {/* Accordion 1: Details */}
            <div className="border-b border-onyx/10">
              <button 
                onClick={() => setOpenAccordion(openAccordion === 'details' ? null : 'details')}
                className="flex items-center justify-between w-full py-4 bg-transparent border-none cursor-pointer group"
              >
                <div className="flex items-center gap-3 text-[#1A1A1A]">
                  <Leaf size={16} strokeWidth={1.5} className="group-hover:text-[#1A1A1A]/60 transition-colors" />
                  <span className="font-metropolis text-[10px] tracking-wider uppercase group-hover:text-[#1A1A1A]/60 transition-colors">Product Details</span>
                </div>
                {openAccordion === 'details' ? <ChevronUp size={16} className="text-[#1A1A1A]/50" /> : <ChevronDown size={16} className="text-[#1A1A1A]/50" />}
              </button>
              <AnimatePresence>
                {openAccordion === 'details' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="font-inter text-xs text-[#1A1A1A]/60 leading-relaxed pb-4">
                      Crafted from 100% organic fibers. This piece features our signature relaxed silhouette, French seams, and Corozo nut buttons. Pre-washed for incredible softness and zero shrinkage.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 2 */}
            <div className="border-b border-onyx/10">
              <button 
                onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                className="flex items-center justify-between w-full py-4 bg-transparent border-none cursor-pointer group"
              >
                <div className="flex items-center gap-3 text-[#1A1A1A]">
                  <Truck size={16} strokeWidth={1.5} className="group-hover:text-[#1A1A1A]/60 transition-colors" />
                  <span className="font-metropolis text-[10px] tracking-wider uppercase group-hover:text-[#1A1A1A]/60 transition-colors">Free Shipping & Returns</span>
                </div>
                {openAccordion === 'shipping' ? <ChevronUp size={16} className="text-[#1A1A1A]/50" /> : <ChevronDown size={16} className="text-[#1A1A1A]/50" />}
              </button>
              <AnimatePresence>
                {openAccordion === 'shipping' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="font-inter text-xs text-[#1A1A1A]/60 leading-relaxed pb-4">
                      Complimentary express shipping across India on all orders. Returns are accepted within 14 days of delivery, provided the garment remains unworn with original tags attached.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>

      {/* Styled With / Complete The Look */}
      <StyledWith currentProductId={product.id} currentCategory={product.tags?.[0]} allProducts={allProducts} />

      {/* Recently Admired Browsing History */}
      <RecentlyViewed 
        currentProduct={{
          id: product.id,
          handle: product.handle,
          title: product.title,
          price: numericPrice,
          image: product.images.edges[0]?.node?.url || '/placeholder.png',
          category: product.tags?.[0]
        }}
      />

      {/* Sticky Mobile "Add to Cart" Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-onyx/10 p-4 z-50 flex items-center justify-between gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col">
          <span className="font-jost text-xs uppercase tracking-widest text-[#1A1A1A] line-clamp-1">{product.title}</span>
          <span className="font-inter text-sm font-bold text-[#1A1A1A]">{formattedPrice}</span>
        </div>
        <div className="flex items-center gap-2">
          <WishlistButton 
            item={{
              id: product.id,
              handle: product.handle,
              title: product.title,
              price: numericPrice,
              image: product.images.edges[0]?.node?.url || '/placeholder.png',
              subtext: product.tags?.[0]
            }} 
            size={18}
            className="p-2.5 border border-stone-300 rounded-none bg-white"
          />
          <button
            onClick={handleAddToBag}
            disabled={!selectedVariant?.availableForSale}
            className="bg-[#1A1A1A] text-[#FDFBF7] font-metropolis font-light text-[10px] uppercase tracking-[0.2em] px-6 py-3 rounded-none cursor-pointer border-none flex items-center gap-2 disabled:opacity-50"
          >
            {selectedVariant?.availableForSale ? 'Add To Bag' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Fit Concierge Modal */}
      <FitConciergeModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        onSelectSize={handleSizeSelect}
        productTitle={product.title}
      />
    </div>
  );
}
