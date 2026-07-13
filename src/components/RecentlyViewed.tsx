"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import WishlistButton from '@/components/WishlistButton';

export interface ViewedItem {
  id: string;
  handle: string;
  title: string;
  price: number;
  image: string;
  category?: string;
}

interface RecentlyViewedProps {
  currentProduct?: ViewedItem;
}

export default function RecentlyViewed({ currentProduct }: RecentlyViewedProps) {
  const [history, setHistory] = useState<ViewedItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const storageKey = 'mouleeta_recently_viewed';
      try {
        const stored = localStorage.getItem(storageKey);
        let items: ViewedItem[] = stored ? JSON.parse(stored) : [];

        if (currentProduct) {
          // Remove existing occurrence if already there
          items = items.filter((item) => item.id !== currentProduct.id && item.handle !== currentProduct.handle);
          // Add current to front
          items.unshift(currentProduct);
          // Keep max 6
          items = items.slice(0, 6);
          localStorage.setItem(storageKey, JSON.stringify(items));
        }

        setHistory(items);
      } catch (e) {
        console.error("Failed to access localStorage for browsing history:", e);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [currentProduct]);

  if (!mounted) return null;

  // Exclude current product from display
  const displayItems = history.filter(
    (item) => !currentProduct || (item.id !== currentProduct.id && item.handle !== currentProduct.handle)
  ).slice(0, 4);

  if (displayItems.length === 0) return null;

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-16 border-t border-onyx/10 mb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-stone-400 mb-1">
            <Clock size={13} className="text-stone-500" />
            <span className="font-metropolis text-[9px] tracking-[0.25em] uppercase font-bold text-stone-500">
              Personal Session Journal
            </span>
          </div>
          <h3 className="font-jost font-light text-xl md:text-2xl tracking-[0.18em] uppercase text-stone-900">
            Recently Admired Pieces
          </h3>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('mouleeta_recently_viewed');
            setHistory([]);
          }}
          className="font-metropolis text-[9px] tracking-[0.15em] uppercase text-stone-400 hover:text-stone-800 transition-colors cursor-pointer border-b border-stone-300 pb-0.5"
        >
          Clear Journal
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {displayItems.map((item) => (
          <div key={item.id} className="group flex flex-col justify-between">
            <div>
              <Link href={`/products/${item.handle}`} className="block relative aspect-[3/4] bg-[#F5EFE7] overflow-hidden mb-3">
                <Image
                  src={item.image || '/placeholder.png'}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-2.5 right-2.5 z-10">
                  <WishlistButton
                    item={{
                      id: item.id,
                      handle: item.handle,
                      title: item.title,
                      price: item.price,
                      image: item.image || '/placeholder.png',
                      subtext: item.category
                    }}
                    size={16}
                  />
                </div>
              </Link>

              <Link href={`/products/${item.handle}`}>
                <h4 className="font-jost font-light text-xs tracking-[0.12em] uppercase text-stone-900 line-clamp-1 hover:text-stone-600 transition-colors mb-1">
                  {item.title}
                </h4>
              </Link>
              <span className="font-inter text-xs font-semibold text-stone-800">
                ₹{item.price.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
