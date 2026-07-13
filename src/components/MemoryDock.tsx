'use client';

import React, { useState } from 'react';
import { useMemoryStore } from '@/store/useMemoryStore';
import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';

export default function MemoryDock() {
  const { items, removeRecentItem, clearMemory } = useMemoryStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const isCartOpen = useCartStore((state) => state.isOpen);
  const [isHovered, setIsHovered] = useState(false);

  if (items.length === 0) return null;

  const handleAdd = (item: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: item.id,
      variantId: item.id,
      title: item.title,
      subtext: 'Quick Add',
      price: item.price,
      image: item.image,
      size: 'M' // Default size for quick add
    });
  };

  return (
    <div 
      className={`fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-[95%] md:w-auto transition-opacity duration-300 ${isCartOpen ? 'opacity-0' : 'opacity-100'}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <motion.div
        drag
        dragMomentum={false}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="pointer-events-auto bg-[#FAF9F6]/80 backdrop-blur-md border border-black/10 rounded-2xl p-3 shadow-2xl flex flex-col items-center gap-2 relative group resize overflow-hidden min-w-[280px] min-h-[120px] max-w-full mx-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex justify-between items-center w-full px-1">
          <span className="font-metropolis text-[9px] uppercase tracking-[0.2em] text-[#1A1A1A]/70 font-semibold">
            Memory Dock
          </span>
          <button 
            onClick={clearMemory}
            className="text-[9px] uppercase tracking-widest text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>

        <div className="flex items-start gap-3 overflow-x-auto no-scrollbar touch-pan-x w-full py-1">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                className="relative group/item flex-shrink-0 flex flex-col gap-1.5 items-center"
              >
                <Link href={`/products/${item.handle}`} className="block relative w-14 h-[72px] rounded-lg overflow-hidden border border-black/5 shadow-sm transition-transform duration-300 hover:scale-105 hover:border-black/20 hover:shadow-md">
                  <Image
                    src={item.image || '/placeholder.png'}
                    alt={item.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none" />
                </Link>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeRecentItem(item.id);
                  }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 cursor-pointer shadow-sm hover:scale-110"
                >
                  <X size={10} />
                </button>

                {/* Expanding Add to Cart Button */}
                <AnimatePresence>
                  {(isHovered || items.length === 1) && (
                    <motion.button
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      onClick={(e) => handleAdd(item, e)}
                      className="text-[8px] uppercase tracking-wider bg-[#1A1A1A] text-white px-2 py-1.5 rounded-sm hover:bg-neutral-800 w-full flex items-center justify-center gap-1 overflow-hidden whitespace-nowrap cursor-pointer shadow-sm"
                    >
                      <ShoppingBag size={8} /> Add
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
      </motion.div>
    </div>
  );
}
