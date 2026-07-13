"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, Trash2, ArrowRight, Heart } from 'lucide-react';

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] py-32 px-6 flex flex-col items-center justify-center">
        <div className="w-12 h-[1px] bg-stone-900 animate-pulse mb-4" />
        <p className="font-jost text-xs uppercase tracking-[0.25em] text-stone-500">Loading Privé Closet...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] py-24 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="border-b border-stone-200 pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-metropolis text-[9px] tracking-[0.25em] uppercase text-stone-400 block mb-2">
              Mouleeta Privé Concierge
            </span>
            <h1 className="font-jost font-light text-3xl md:text-4xl tracking-[0.2em] uppercase text-stone-900">
              My Saved Closet ({wishlist.length})
            </h1>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to clear your Privé wishlist?")) {
                  clearWishlist();
                }
              }}
              className="text-[10px] font-jost tracking-[0.2em] uppercase text-stone-400 hover:text-red-600 transition-colors cursor-pointer w-fit"
            >
              Clear Closet
            </button>
          )}
        </header>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto flex flex-col items-center bg-white p-12 border border-onyx/5 shadow-sm">
            <Heart size={32} className="text-stone-300 mb-6 font-light" strokeWidth={1} />
            <h2 className="font-jost font-light text-xl tracking-[0.2em] uppercase text-stone-900 mb-3">
              Your Closet is Empty
            </h2>
            <p className="font-inter text-xs text-stone-500 tracking-wider mb-8 leading-relaxed">
              Explore our handcrafted collections and save your favorite silhouettes for future evening wear or seasonal wardrobe curation.
            </p>
            <Link
              href="/collections/dresses"
              className="bg-stone-900 text-white font-metropolis text-[10px] tracking-[0.25em] uppercase px-8 py-4 hover:bg-black transition-all duration-300 flex items-center gap-2"
            >
              Explore Collections <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlist.map((item) => (
              <div key={item.handle} className="group bg-white border border-onyx/5 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300">
                
                <div>
                  {/* Image Container */}
                  <Link href={`/products/${item.handle}`} className="block relative aspect-[3/4] bg-[#F5EFE7] overflow-hidden">
                    <Image
                      src={item.image || '/placeholder.png'}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    
                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromWishlist(item.handle);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-stone-600 hover:text-red-600 transition-colors backdrop-blur-sm cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={15} />
                    </button>
                  </Link>

                  {/* Typography */}
                  <div className="p-5">
                    {item.subtext && (
                      <span className="font-metropolis text-[9px] tracking-[0.2em] uppercase text-stone-400 block mb-1">
                        {item.subtext}
                      </span>
                    )}
                    <Link href={`/products/${item.handle}`}>
                      <h3 className="font-jost font-light text-sm tracking-[0.18em] uppercase text-stone-900 line-clamp-1 hover:text-stone-600 transition-colors mb-2">
                        {item.title}
                      </h3>
                    </Link>
                    <span className="font-inter text-xs font-semibold text-stone-900">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Move to Bag Action Bar */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() => {
                      addToCart({
                        id: item.id || item.handle,
                        variantId: item.id || item.handle,
                        title: item.title,
                        price: item.price,
                        image: item.image,
                        size: 'OS',
                        subtext: item.subtext
                      });
                      removeFromWishlist(item.handle);
                    }}
                    className="w-full bg-stone-900 text-white font-metropolis font-light text-[10px] tracking-[0.2em] uppercase py-3.5 hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag size={13} /> Move To Bag
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
