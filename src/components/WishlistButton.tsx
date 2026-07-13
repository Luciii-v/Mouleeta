"use client";
import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlistStore, WishlistItem } from '@/store/useWishlistStore';

interface WishlistButtonProps {
  item: WishlistItem;
  className?: string;
  size?: number;
  showText?: boolean;
}

export default function WishlistButton({ item, className = "", size = 18, showText = false }: WishlistButtonProps) {
  const [mounted, setMounted] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <button 
        type="button" 
        className={`p-2 rounded-full bg-white/80 backdrop-blur-sm border border-black/5 hover:bg-white transition-all duration-300 ${className}`}
        aria-label="Add to wishlist"
      >
        <Heart size={size} className="text-stone-700" />
      </button>
    );
  }

  const isSaved = isInWishlist(item.handle);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(item);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group flex items-center gap-2 p-2.5 rounded-full transition-all duration-300 cursor-pointer ${
        showText 
          ? 'px-4 py-3 bg-white border border-stone-300 hover:border-black' 
          : 'bg-white/85 hover:bg-white backdrop-blur-sm border border-black/5 shadow-sm hover:scale-110'
      } ${className}`}
      aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
      title={isSaved ? "Remove from wishlist" : "Add to Mouleeta Privé Wishlist"}
    >
      <Heart
        size={size}
        className={`transition-all duration-300 ${
          isSaved
            ? 'fill-red-600 text-red-600 scale-110'
            : 'text-stone-800 group-hover:text-black'
        }`}
      />
      {showText && (
        <span className="text-[11px] font-jost tracking-[0.2em] uppercase text-stone-800">
          {isSaved ? 'Saved in Privé' : 'Add to Wishlist'}
        </span>
      )}
    </button>
  );
}
