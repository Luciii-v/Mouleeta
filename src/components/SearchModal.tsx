"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { mockProducts } from '@/lib/dummyData';
import { useCartStore } from '@/store/useCartStore';
import WishlistButton from '@/components/WishlistButton';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Expanded editorial product database for rich live search
const searchDatabase = [
  ...mockProducts,
  {
    id: "silk-georgette-evening-gown",
    title: "Silk Georgette Evening Gown",
    slug: "silk-georgette-evening-gown",
    price: 32500,
    description: "A breathtaking floor-length evening gown draped from raw silk georgette with a plunging open back and hand-rolled hems.",
    images: ["/georgette-dress.png"],
    categoryId: "women",
    subCategoryId: "dresses",
    inStock: true
  },
  {
    id: "raw-silk-tailored-co-ord",
    title: "Raw Silk Tailored Co-ord Set",
    slug: "raw-silk-tailored-co-ord",
    price: 26900,
    description: "An effortless two-piece ensemble crafted from heavyweight textured raw silk. Includes structured tunic and relaxed wide-leg trouser.",
    images: ["/trousers.png"],
    categoryId: "women",
    subCategoryId: "pants",
    inStock: true
  },
  {
    id: "artisanal-linen-kimono-robe",
    title: "Artisanal Linen Kimono Robe",
    slug: "artisanal-linen-kimono-robe",
    price: 21000,
    description: "Hand-dyed organic European flax linen robe featuring kimono sleeves and a removable waist tie. Designed for resort luxury.",
    images: ["/linen-shirt.png"],
    categoryId: "women",
    subCategoryId: "shirts",
    inStock: true
  }
];

const trendingTags = [
  "Georgette Flow",
  "Linen Shirts",
  "Wide Leg Trousers",
  "Evening Wear",
  "Silk Co-ords",
  "New Arrivals"
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToCart } = useCartStore();

  const [products, setProducts] = useState<any[]>([]);

  // Handle Escape key and auto-focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      // Fetch active Shopify products for search database on open
      import('@/lib/shopify')
        .then(({ getProducts }) => getProducts())
        .then((fetched) => {
          if (fetched && fetched.length > 0) {
            setProducts(
              fetched.map((p) => ({
                id: p.id,
                title: p.title,
                slug: p.handle,
                price: Math.round(parseFloat(p.priceRange?.minVariantPrice?.amount || '0')),
                description: p.description || '',
                images: p.images?.edges?.map((e: any) => e.node.url) || ['/placeholder.png'],
                subCategoryId: p.handle.includes('dress') ? 'dresses' : p.handle.includes('top') || p.handle.includes('shirt') ? 'shirts' : p.handle.includes('bag') ? 'accessories' : 'dresses'
              }))
            );
          }
        })
        .catch(console.error);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchDb = products.length > 0 ? products : searchDatabase;

  // Filter products by query
  const results = query.trim() === ''
    ? []
    : searchDb.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.subCategoryId.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[150] flex flex-col justify-start items-center px-4 md:px-0 pt-4 md:pt-6 pointer-events-auto">
            
            {/* Glassmorphic Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer -z-10"
            />

            {/* Search Container Morph */}
            <motion.div
              layoutId="search-island"
              style={{ borderRadius: 24 }}
              transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.8 }}
              className="relative w-full max-w-2xl bg-[#FAF9F6] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col z-10"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.15, duration: 0.2 } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                className="flex-1 overflow-hidden flex flex-col"
              >
                {/* Search Input Header */}
                <div className="p-6 md:p-8 border-b border-stone-200/80 bg-white flex items-center gap-4">
                  <motion.div layoutId="search-icon">
                    <Search size={22} className="text-stone-400 flex-shrink-0" strokeWidth={1.5} />
                  </motion.div>
                  
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-transparent border-0 text-base md:text-lg font-jost font-light text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-0 uppercase tracking-widest"
                  />

                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="p-2 text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
                      title="Clear query"
                    >
                      <X size={20} />
                    </button>
                  )}

                  <button
                    onClick={onClose}
                    className="ml-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 text-[10px] tracking-widest uppercase font-metropolis transition-colors cursor-pointer"
                  >
                    ESC
                  </button>
                </div>

                {/* Trending Tags Section (Shown when no search query) */}
                {query.trim() === '' && (
                  <div className="p-8 space-y-6 overflow-y-auto">
                    <div className="flex items-center gap-2 text-stone-400">
                      <Sparkles size={14} className="text-stone-600" />
                      <span className="font-metropolis text-[10px] tracking-[0.25em] uppercase">Trending Luxury Searches</span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {trendingTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setQuery(tag)}
                          className="px-5 py-2.5 bg-white border border-stone-200/80 hover:border-stone-900 text-stone-700 hover:text-black font-jost text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-2xs hover:-translate-y-0.5"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    <div className="pt-8 border-t border-stone-200/60 flex justify-end items-center text-[11px] text-stone-400 uppercase tracking-widest">
                      <Link href="/shop" onClick={onClose} className="hover:text-black underline flex items-center gap-1">
                        View All Products <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Search Results Gallery */}
                {query.trim() !== '' && (
                  <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
                    
                    <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                      <span className="font-metropolis text-[10px] tracking-[0.2em] uppercase text-stone-400">
                        Search Results ({results.length})
                      </span>
                      {results.length > 0 && (
                        <span className="text-[11px] font-inter text-stone-500">
                          Showing best matches for &quot;{query}&quot;
                        </span>
                      )}
                    </div>

                    {results.length === 0 ? (
                      <div className="py-16 text-center space-y-4">
                        <p className="font-jost text-base tracking-widest uppercase text-stone-400">
                          No matching silhouettes found for &quot;{query}&quot;
                        </p>
                        <p className="font-inter text-xs text-stone-500 max-w-sm mx-auto">
                          Our atelier suggests searching by fabric (e.g., &quot;Georgette&quot;, &quot;Silk&quot;, &quot;Linen&quot;) or category (&quot;Dresses&quot;, &quot;Trousers&quot;).
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((item) => (
                          <div
                            key={item.id}
                            className="group bg-white border border-onyx/5 p-4 flex flex-col justify-between hover:shadow-lg transition-all duration-300"
                          >
                            <div>
                              <Link href={`/products/${item.slug}`} onClick={onClose} className="block relative aspect-[3/4] bg-[#F5EFE7] overflow-hidden mb-4">
                                <Image
                                  src={item.images[0] || '/placeholder.png'}
                                  alt={item.title}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute top-2 right-2 z-10">
                                  <WishlistButton item={{
                                    id: item.id,
                                    handle: item.slug,
                                    title: item.title,
                                    price: item.price,
                                    image: item.images[0] || '/placeholder.png',
                                    subtext: item.subCategoryId
                                  }} size={16} />
                                </div>
                              </Link>

                              <span className="font-metropolis text-[9px] tracking-[0.2em] uppercase text-stone-400 block mb-1">
                                {item.subCategoryId}
                              </span>
                              <Link href={`/products/${item.slug}`} onClick={onClose}>
                                <h4 className="font-jost font-light text-sm tracking-[0.15em] uppercase text-stone-900 line-clamp-1 hover:text-stone-600 transition-colors mb-1">
                                  {item.title}
                                </h4>
                              </Link>
                              <span className="font-inter text-xs font-semibold text-stone-900 block mb-4">
                                ₹{item.price.toLocaleString('en-IN')}
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  addToCart({
                                    id: item.id,
                                    variantId: item.id,
                                    title: item.title,
                                    price: item.price,
                                    image: item.images[0] || '/placeholder.png',
                                    size: 'OS',
                                    subtext: item.subCategoryId
                                  });
                                }}
                                className="flex-1 bg-stone-900 text-white font-metropolis text-[9px] tracking-[0.2em] uppercase py-3 hover:bg-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <ShoppingBag size={12} /> Bag
                              </button>
                              <Link
                                href={`/products/${item.slug}`}
                                onClick={onClose}
                                className="px-3 py-3 border border-stone-200 hover:border-black text-stone-700 flex items-center justify-center transition-colors"
                                title="View piece details"
                              >
                                <ArrowRight size={14} />
                              </Link>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
