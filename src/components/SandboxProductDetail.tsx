'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, ArrowLeft, Truck, ChevronDown, ChevronUp, Leaf, Ruler, Sparkles, Scissors, ArrowRight, Pin } from 'lucide-react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MagneticButton from '@/components/MagneticButton';
import WishlistButton from '@/components/WishlistButton';
import FitConciergeModal from '@/components/FitConciergeModal';
import VIPConcierge from '@/components/VIPConcierge';
import RecentlyViewed from '@/components/RecentlyViewed';
import { useMemoryStore } from '@/store/useMemoryStore';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export default function SandboxProductDetail({ product, allProducts }: ProductDetailProps) {
  const { status } = useSession();
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const addRecentItem = useMemoryStore((state) => state.addRecentItem);
  
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

  // Check if Shopify has real variants
  const hasShopifyVariants = allVariants.length > 1 || (allVariants[0] && allVariants[0].title !== 'Default Title');

  // Find all unique color and size option values
  const allColors = (hasShopifyVariants 
    ? Array.from(new Set(allVariants.map(v => getOptionValue(v, 'color')).filter(Boolean)))
    : (LOCAL_PRODUCT_COLORS[product.handle] || [])).filter(c => c.toLowerCase() !== 'dots');

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
  

  // Accordion States
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Parse Shopify Description into Sections
  const parsedSections = {
    top: product.descriptionHtml || '',
    details: '',
    care: '',
    fit: ''
  };

  if (product.descriptionHtml) {
    const html = product.descriptionHtml;
    
    const markers = [
      { id: 'fit', regex: /Fit\s*(?:&|&amp;)\s*Model(?:\s*Info(?:rmation)?)?\s*:?/i, label: 'Fit & Model Info' },
      { id: 'care', regex: /Care\s*Instructions\s*:?/i, label: 'Care Instructions' },
      { id: 'details', regex: /Product\s*Details\s*:?/i, label: 'Product Details' }
    ];

    // Find positions of all markers
    const foundMarkers = markers
      .map(m => {
        const match = html.match(m.regex);
        const rawIdx = match && match.index !== undefined ? match.index : -1;
        let idx = rawIdx;

        if (idx !== -1) {
          const precedingText = html.substring(Math.max(0, idx - 50), idx);
          // Look for <p...> or <p...><strong> or <strong> immediately before
          const pStrongMatch = precedingText.match(/<p[^>]*>\s*<strong[^>]*>\s*$/i);
          const pMatch = precedingText.match(/<p[^>]*>\s*$/i);
          const strongMatch = precedingText.match(/<strong[^>]*>\s*$/i);
          
          if (pStrongMatch) {
            idx -= pStrongMatch[0].length;
          } else if (pMatch) {
            idx -= pMatch[0].length;
          } else if (strongMatch) {
            idx -= strongMatch[0].length;
          }
        }

        return {
          ...m,
          idx,
          rawIdx,
          matchLength: match ? match[0].length : 0
        };
      })
      .filter(m => m.idx !== -1)
      .sort((a, b) => a.idx - b.idx);

    // Extract content for each marker
    foundMarkers.forEach((marker, i) => {
      const start = marker.rawIdx + marker.matchLength;
      const end = (i < foundMarkers.length - 1) ? foundMarkers[i + 1].idx : html.length;
      
      let content = html.substring(start, end);
      // Clean up stray closing tags that were part of the matched marker block
      content = content.replace(/^(?:<\/strong>|<\/em>|<\/span>|<\/p>|<br\s*\/?>|\s)+/i, '').trim();
      content = content.replace(/(?:<br\s*\/?>|<\/?p>|\s)+$/i, '').trim();
      
      parsedSections[marker.id as keyof typeof parsedSections] = content;
    });

    // The top section is everything before the first marker
    if (foundMarkers.length > 0) {
      parsedSections.top = html.substring(0, foundMarkers[0].idx);
    } else {
      parsedSections.top = html;
    }
    
    // Clean up top description — strip "Description :" label (including wrapped in <strong>)
    // Also strip the leading product-name phrase that Shopify includes at the start
    // e.g. "Midnight Blue Ikkat Cotton Maxi Dress Effortlessly..." → strip "Midnight Blue Ikkat Cotton Maxi Dress"
    parsedSections.top = parsedSections.top
      .replace(/<strong>\s*Description\s*:?\s*<\/strong>/gi, '') // <strong>Description :</strong>
      .replace(/Description\s*:/gi, '')                           // plain "Description :"
      .replace(/<p>\s*<\/p>/g, '')
      .replace(/^(?:<br\s*\/?>|<\/?p[^>]*>|\s)+/, '')            // leading whitespace/tags
      .replace(/(?:<br\s*\/?>|<\/?p[^>]*>|\s)+$/, '')            // trailing whitespace/tags
      .trim();

    // Strip leading product-name phrase from plain text start of description.
    // Pattern: captures text like "Midnight Blue Ikkat Cotton Maxi Dress " before the real description.
    // We detect this by matching: one or more capitalized words ending in a product-type word, 
    // followed immediately by the next sentence (which doesn't start with a product type word).
    const productTypeWords = ['Dress', 'Top', 'Set', 'Sets', 'Shirt', 'Blouse', 'Skirt', 'Pant', 'Pants', 'Trouser', 'Trousers', 'Kurta', 'Saree', 'Jumpsuit', 'Co-ord', 'Suit'];
    const productTypePart = productTypeWords.join('|');
    // Match: [optional HTML open tag][words including color/fabric/hyphens] + [product type] + [any trailing title words] up to a break
    const leadingNamePattern = new RegExp(
      `^(<[^>]+>\\s*)*([A-Z][a-zA-Z\\s&\\-]*?(${productTypePart})[a-zA-Z\\s&\\-]*?)(?:<\\/p>|<br\\s*\\/?>|\\.|\\n|$)`,
      'i'
    );
    parsedSections.top = parsedSections.top.replace(leadingNamePattern, (_match, tags) => tags || '');
    // Clean up any leftover leading junk/punctuation after stripping
    parsedSections.top = parsedSections.top
      .replace(/^[\s–—,.\xa0]+/, '')
      .replace(/^(?:<\/?p[^>]*>|<br\s*\/?>|\s)+/, '')
      .trim();
  }

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


  const handleAddToBag = () => {
    if (status !== "authenticated") {
      router.push("/account/login");
      return;
    }
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
    <>
      {/* 100vh Immersive Hero Section */}
      <div className="relative w-full h-[100dvh] bg-[#1A1A1A]">
        <Image
          src={primaryImage}
          alt={product.title}
          fill
          priority
          className="object-cover opacity-90"
          draggable={false}
        />
        {/* Subtle Dark Gradient Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 pointer-events-none" />
        
        {/* Floating Header Actions */}
        <div className="absolute top-8 left-6 md:left-12 z-10">
          <Link
            href={`/sandbox`}
            className="group flex items-center gap-3 font-metropolis text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors drop-shadow-sm"
          >
            <ArrowLeft size={16} strokeWidth={1.5} className="transition-transform group-hover:-translate-x-1" />
            Back to Grid
          </Link>
        </div>

        {/* Hero Title */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
          <span className="font-metropolis font-medium text-[10px] md:text-[12px] uppercase tracking-[0.4em] text-white/80 mb-6 drop-shadow-md">
            {product.productType || 'Apparel'}
          </span>
          <h1 className="font-jost font-light text-5xl sm:text-6xl md:text-[80px] text-white tracking-[0.1em] uppercase leading-[1.1] drop-shadow-lg max-w-5xl">
            {product.title}
          </h1>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-none">
          <span className="font-metropolis text-[9px] uppercase tracking-[0.3em] text-white/70">Scroll to Discover</span>
          <div className="w-[1px] h-12 bg-white/30 relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 w-full h-1/2 bg-white"
              animate={{ y: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </div>
        </div>
      </div>

      {/* Main Content (Below the Fold) */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-16 md:py-24 flex flex-col gap-12 md:gap-16">
      {/* Status Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-onyx/10">
        <span className="font-metropolis text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-[#1A1A1A]/40">
          Mouleeta Couture &nbsp;/&nbsp; SKU: {selectedVariant?.sku || 'MOU-COL'}
        </span>
      </div>

      {/* 2-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Remaining Image Gallery (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-4 items-start select-none">
          {images.slice(1).map((img, idx) => (
            <div 
              key={idx}
              className="w-full relative aspect-[3/4] bg-[#F6F1E8] border border-onyx/5"
            >
              <Image
                src={img}
                alt={`${product.title} view ${idx + 2}`}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Right Column: Product Details (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col items-start w-full sticky top-32">
          
          {/* Tag & Category Breadcrumb */}
          <span className="font-metropolis text-[10px] tracking-[0.25em] uppercase text-[#1A1A1A]/50 mb-3">
            {product.productType || 'Apparel'} &nbsp;·&nbsp; {product.vendor || 'Mouleeta'}
          </span>

          {/* Large Title */}
          <h2 className="font-jost font-light text-2xl sm:text-3xl tracking-[0.15em] text-[#1A1A1A] uppercase leading-tight mb-4">
            {product.title}
          </h2>

          {/* Price Tag */}
          <span className="font-inter text-xl font-bold text-[#1A1A1A] mb-8 block">
            {formattedPrice}
          </span>

          {/* Separation Divider */}
          <div className="w-full h-[1px] bg-onyx/10 mb-8" />

          {parsedSections.top ? (
            <div 
              suppressHydrationWarning
              className="product-description font-jost text-[13px] md:text-[14px] text-stone-600 font-light leading-[1.8] tracking-[0.03em] mb-8"
              dangerouslySetInnerHTML={{ __html: parsedSections.top }}
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
              <div className="flex flex-wrap gap-3 items-center">
                {allColors.map((color) => {
                  const isSelected = selectedColor === color;
                  // Determine if this is a real CSS color or a pattern/texture label
                  const knownColors: Record<string, string> = {
                    white: '#FFFFFF', black: '#1A1A1A', blue: 'navy', navy: 'navy',
                    'midnight blue': '#13294B', 'light blue': '#ADD8E6', 'sky blue': '#87CEEB',
                    pink: '#E8A0A8', 'hot pink': '#FF69B4', 'dusty pink': '#DCAE96', 'rose pink': '#FFC0CB',
                    red: '#C0392B', green: '#2E7D32', yellow: '#F9C74F',
                    orange: '#F4845F', purple: '#7B2D8B', grey: '#808080', gray: '#808080',
                    brown: '#7B5E3A', beige: '#C8A97C', ivory: '#FFFFF0', cream: '#FFFDD0',
                    indigo: '#4B0082', teal: '#008080', coral: '#FF6B6B', lavender: '#B57BEE',
                  };
                  
                  // Helper to match colors dynamically
                  const getCssColor = (colorName: string) => {
                    const normalized = colorName.toLowerCase().trim();

                    // Product specific overrides
                    if (product.handle === 'tie-dye' && (normalized.includes('pink') || normalized === 'pink')) {
                      return '#FF46A2';
                    }

                    if (knownColors[normalized]) return knownColors[normalized];
                    
                    // Fallbacks for common bases
                    if (normalized.includes('blue')) return '#13294B';
                    if (normalized.includes('pink')) return '#E8A0A8';
                    if (normalized.includes('red')) return '#C0392B';
                    if (normalized.includes('green')) return '#2E7D32';
                    if (normalized.includes('yellow')) return '#F9C74F';
                    
                    return null;
                  };

                  const cssColor = getCssColor(color);
                  const isPatternLabel = !cssColor; // e.g. "Dots", "Ikat", "Stripe"

                  if (isPatternLabel) {
                    // Render as a text pill swatch
                    return (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        title={color}
                        className={`h-8 px-3 border text-[10px] uppercase tracking-widest font-metropolis transition-all duration-300 cursor-pointer rounded-none ${
                          isSelected
                            ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                            : 'border-onyx/20 text-[#1A1A1A] hover:border-[#1A1A1A] bg-transparent'
                        }`}
                      >
                        {color}
                      </button>
                    );
                  }

                  return (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      className={`w-8 h-8 rounded-full border transition-all duration-300 relative cursor-pointer ${
                        isSelected
                          ? 'border-[#1A1A1A] scale-110'
                          : 'border-onyx/15 hover:border-[#1A1A1A] hover:scale-105'
                      }`}
                      title={color}
                    >
                      <span
                        className="absolute inset-1 rounded-full border border-black/5"
                        style={{ backgroundColor: cssColor }}
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
                  className="w-full flex bg-[#1A1A1A] text-[#FDFBF7] font-metropolis font-light text-[11px] uppercase tracking-[0.25em] py-5 transition-all duration-300 rounded-none cursor-pointer border border-[#1A1A1A] items-center justify-center gap-2.5 hover:-translate-y-1 hover:bg-[#FDFBF7] hover:text-[#1A1A1A] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  <ShoppingBag size={14} strokeWidth={2} />
                  {selectedVariant?.availableForSale ? 'Add To Bag' : 'Out of Stock'}
                </button>
              </MagneticButton>
            </div>
            <div className="flex gap-3">
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
                className="p-4 border border-stone-300 rounded-none hover:border-black relative hover:z-10 bg-white hover:bg-stone-50 hover:scale-110 active:scale-[0.98] hover:shadow-md transition-all duration-300"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addRecentItem({
                    id: product.id,
                    handle: product.handle,
                    title: product.title,
                    image: primaryImage,
                    price: numericPrice
                  });
                }}
                className="group p-4 border border-stone-300 rounded-none hover:border-black relative hover:z-10 bg-white hover:bg-stone-50 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-[0.98] hover:shadow-md"
                title="Pin to Memory Dock"
              >
                <Pin size={20} className="text-stone-800 transition-colors duration-300 group-hover:text-black" />
              </button>
            </div>
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

            {/* Accordion: Product Details */}
            {(parsedSections.details || !product.descriptionHtml) && (
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
                      <div 
                        suppressHydrationWarning
                        className="product-description font-jost text-[13px] text-[#1A1A1A]/70 leading-[1.8] pb-6"
                        dangerouslySetInnerHTML={{ __html: parsedSections.details || 'Crafted from 100% organic fibers. This piece features our signature relaxed silhouette, French seams, and Corozo nut buttons. Pre-washed for incredible softness and zero shrinkage.' }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Accordion: Fit & Model */}
            {parsedSections.fit && (
              <div className="border-b border-onyx/10">
                <button 
                  onClick={() => setOpenAccordion(openAccordion === 'fit' ? null : 'fit')}
                  className="flex items-center justify-between w-full py-4 bg-transparent border-none cursor-pointer group"
                >
                  <div className="flex items-center gap-3 text-[#1A1A1A]">
                    <Ruler size={16} strokeWidth={1.5} className="group-hover:text-[#1A1A1A]/60 transition-colors" />
                    <span className="font-metropolis text-[10px] tracking-wider uppercase group-hover:text-[#1A1A1A]/60 transition-colors">Fit & Model Info</span>
                  </div>
                  {openAccordion === 'fit' ? <ChevronUp size={16} className="text-[#1A1A1A]/50" /> : <ChevronDown size={16} className="text-[#1A1A1A]/50" />}
                </button>
                <AnimatePresence>
                  {openAccordion === 'fit' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div 
                        suppressHydrationWarning
                        className="product-description font-jost text-[13px] text-[#1A1A1A]/70 leading-[1.8] pb-6"
                        dangerouslySetInnerHTML={{ __html: parsedSections.fit }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Accordion: Care Instructions */}
            {parsedSections.care && (
              <div className="border-b border-onyx/10">
                <button 
                  onClick={() => setOpenAccordion(openAccordion === 'care' ? null : 'care')}
                  className="flex items-center justify-between w-full py-4 bg-transparent border-none cursor-pointer group"
                >
                  <div className="flex items-center gap-3 text-[#1A1A1A]">
                    <Sparkles size={16} strokeWidth={1.5} className="group-hover:text-[#1A1A1A]/60 transition-colors" />
                    <span className="font-metropolis text-[10px] tracking-wider uppercase group-hover:text-[#1A1A1A]/60 transition-colors">Care Instructions</span>
                  </div>
                  {openAccordion === 'care' ? <ChevronUp size={16} className="text-[#1A1A1A]/50" /> : <ChevronDown size={16} className="text-[#1A1A1A]/50" />}
                </button>
                <AnimatePresence>
                  {openAccordion === 'care' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div 
                        suppressHydrationWarning
                        className="product-description font-jost text-[13px] text-[#1A1A1A]/70 leading-[1.8] pb-6"
                        dangerouslySetInnerHTML={{ __html: parsedSections.care }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Accordion: Shipping */}
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
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-onyx/10 p-4 z-50 flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="font-jost text-xs uppercase tracking-widest text-[#1A1A1A] line-clamp-1">{product.title}</span>
          <span className="font-inter text-sm font-bold text-[#1A1A1A]">{formattedPrice}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                addRecentItem({
                  id: product.id,
                  handle: product.handle,
                  title: product.title,
                  image: primaryImage,
                  price: numericPrice
                });
              }}
              className="group p-2.5 border border-stone-300 rounded-none hover:border-black relative hover:z-10 bg-white hover:bg-stone-50 transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-[0.98] hover:shadow-md"
              title="Pin to Memory Dock"
            >
              <Pin size={18} className="text-stone-800 transition-colors duration-300 group-hover:text-black" />
            </button>
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
              className="p-2.5 border border-stone-300 rounded-none hover:border-black relative hover:z-10 bg-white hover:bg-stone-50 hover:scale-110 active:scale-[0.98] hover:shadow-md transition-all duration-300"
            />
          </div>
          <button
            onClick={handleAddToBag}
            disabled={!selectedVariant?.availableForSale}
            className="bg-[#1A1A1A] text-[#FDFBF7] font-metropolis font-light text-[10px] uppercase tracking-[0.2em] px-6 py-3 rounded-none cursor-pointer border-none flex items-center gap-2 disabled:opacity-50"
          >
            {selectedVariant?.availableForSale ? 'Add To Bag' : 'Out of Stock'}
          </button>
        </div>
      </div>


      {/* Search overlay & other modals */}
      <FitConciergeModal 
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        onSelectSize={handleSizeSelect}
        productTitle={product.title}
      />
    </div>
    </>
  );
}
