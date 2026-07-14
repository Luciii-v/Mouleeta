'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

interface ShopDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShopDrawer({ isOpen, onClose }: ShopDrawerProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-500 ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* 2. Fixed, full-screen dark overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-label="Close menu overlay"
      />

      {/* 3. The Drawer UI fixed to left, ~85vw max-w-md, high z-index */}
      <aside
        className={`fixed left-0 top-0 h-full w-[85vw] max-w-md bg-[#f6f1e8] text-[#231f20] z-50 shadow-2xl flex flex-col overflow-hidden transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header with Brand Title and Close Button */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#231f20]/10 shrink-0">
          <Link
            href="/"
            onClick={onClose}
            className="font-metropolis text-xs font-light tracking-[0.25em] uppercase text-[#231f20]"
          >
            MOULEETA
          </Link>

          {/* 5. Close Button: Clean 'X' SVG icon at top right */}
          <button
            onClick={onClose}
            className="p-2 text-[#231f20]/70 hover:text-[#231f20] transition-colors cursor-pointer -mr-2"
            aria-label="Close navigation drawer"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* Drawer Content: Stacked categories vertically */}
        <div className="flex-1 overflow-y-auto px-8 py-8 flex flex-col gap-10 no-scrollbar">
          
          {/* Category 1: DRESSES */}
          <div className="flex flex-col">
            <span className="font-jost text-[11px] font-semibold tracking-[0.2em] uppercase text-[#231f20]/60 mb-3.5 block">
              DRESSES
            </span>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/products/collar-dress"
                onClick={onClose}
                className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300"
              >
                Collar Dress
              </Link>
              <Link
                href="/products/backless-dress"
                onClick={onClose}
                className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300"
              >
                Backless Dress
              </Link>
              <Link
                href="/products/slit-dress"
                onClick={onClose}
                className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300"
              >
                Slit Dress
              </Link>
              <Link
                href="/products/short-dress"
                onClick={onClose}
                className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300"
              >
                Short Dress
              </Link>
              
              {/* Underlined link */}
              <div className="pt-1.5">
                <Link
                  href="/shop?category=DRESSES"
                  onClick={onClose}
                  className="inline-block border-b border-[#231f20]/40 pb-0.5 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-[#231f20] hover:border-[#231f20] hover:opacity-75 transition-all"
                >
                  SHOP ALL DRESSES
                </Link>
              </div>
            </div>
          </div>

          {/* Category 2: SETS & SPECIAL EDITS */}
          <div className="flex flex-col">
            <span className="font-jost text-[11px] font-semibold tracking-[0.2em] uppercase text-[#231f20]/60 mb-3.5 block">
              SETS & SPECIAL EDITS
            </span>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/products/co-ord-sets"
                onClick={onClose}
                className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300"
              >
                Co-ord Sets
              </Link>
              <Link
                href="/products/tie-n-dye"
                onClick={onClose}
                className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300"
              >
                Tie n Dye
              </Link>

              {/* Underlined links exactly as styled */}
              <div className="pt-1.5 flex flex-col gap-3.5 items-start">
                <Link
                  href="/shop?category=CO-ORDS"
                  onClick={onClose}
                  className="inline-block border-b border-[#231f20]/40 pb-0.5 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-[#231f20] hover:border-[#231f20] hover:opacity-75 transition-all"
                >
                  SHOP CO-ORD SETS
                </Link>
                <Link
                  href="/shop?category=TIE-N-DYE"
                  onClick={onClose}
                  className="inline-block border-b border-[#231f20]/40 pb-0.5 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-[#231f20] hover:border-[#231f20] hover:opacity-75 transition-all"
                >
                  SHOP TIE & DYE
                </Link>
              </div>
            </div>
          </div>

          {/* Category 3: ACCESSORIES */}
          <div className="flex flex-col">
            <span className="font-jost text-[11px] font-semibold tracking-[0.2em] uppercase text-[#231f20]/60 mb-3.5 block">
              ACCESSORIES
            </span>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/products/blue-bag"
                onClick={onClose}
                className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300"
              >
                Blue Bag
              </Link>
              <Link
                href="/products/pink-bag"
                onClick={onClose}
                className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300"
              >
                Pink Bag
              </Link>

              {/* Underlined link */}
              <div className="pt-1.5">
                <Link
                  href="/shop?category=ACCESSORIES"
                  onClick={onClose}
                  className="inline-block border-b border-[#231f20]/40 pb-0.5 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-[#231f20] hover:border-[#231f20] hover:opacity-75 transition-all"
                >
                  SHOP ACCESSORIES
                </Link>
              </div>
            </div>
          </div>

          {/* Category 4: OUR WORLD */}
          <div className="flex flex-col pb-8">
            <span className="font-jost text-[11px] font-semibold tracking-[0.2em] uppercase text-[#231f20]/60 mb-3.5 block">
              OUR WORLD
            </span>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/philosophy"
                onClick={onClose}
                className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300"
              >
                Our Philosophy
              </Link>
              <Link
                href="/sustainability"
                onClick={onClose}
                className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300"
              >
                Sustainability & Care
              </Link>
              <Link
                href="/journal"
                onClick={onClose}
                className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300"
              >
                The Journal
              </Link>
            </div>
          </div>

        </div>

        {/* Optional Drawer Footer */}
        <div className="px-8 py-6 border-t border-[#231f20]/10 shrink-0 bg-[#f6f1e8]/80 backdrop-blur-xs flex items-center justify-between text-[10px] text-[#231f20]/60 uppercase tracking-widest font-jost">
          <span>Crafted Consciously</span>
          <span>100% Linen</span>
        </div>
      </aside>
    </div>
  );
}
