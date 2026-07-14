'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { X } from 'lucide-react';

interface ShopDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function ShopDrawer({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: ShopDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted || typeof window === 'undefined') return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[150] transition-all duration-500 ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Dark, semi-transparent backdrop overlay covering the rest of the screen */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-500 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-label="Close menu overlay"
      />

      {/* Fixed left-side panel with slide-in animation */}
      <aside
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`fixed left-0 top-0 h-full w-[85vw] max-w-sm bg-[#f6f1e8] text-[#231f20] z-50 shadow-2xl flex flex-col overflow-y-auto transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header with Brand Title & Close Button */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#231f20]/10 shrink-0">
          <Link
            href="/"
            onClick={onClose}
            className="font-metropolis text-xs font-light tracking-[0.25em] uppercase text-[#231f20]"
          >
            MOULEETA
          </Link>
          <button
            onClick={onClose}
            className="p-1 text-[#231f20] hover:opacity-60 transition-opacity cursor-pointer"
            aria-label="Close menu"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Vertically Populated Content Map */}
        <div className="flex-1 px-8 py-8 space-y-10">
          
          {/* Section 1: DRESSES */}
          <div>
            <h3 className="font-jost text-xs font-semibold uppercase tracking-[0.2em] text-[#231f20]/70 mb-3 block">
              Dresses
            </h3>
            <div className="flex flex-col space-y-2">
              <Link
                href="/products/collar-dress"
                onClick={onClose}
                className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300 w-fit"
              >
                Collar Dress
              </Link>
              <Link
                href="/products/backless-dress"
                onClick={onClose}
                className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300 w-fit"
              >
                Backless Dress
              </Link>
              <Link
                href="/products/slit-dress"
                onClick={onClose}
                className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300 w-fit"
              >
                Slit Dress
              </Link>
              <Link
                href="/products/short-dress"
                onClick={onClose}
                className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300 w-fit"
              >
                Short Dress
              </Link>
              <Link
                href="/collections/dresses"
                onClick={onClose}
                className="inline-block border-b border-[#231f20]/40 pb-0.5 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-[#231f20] hover:border-[#231f20] hover:opacity-75 transition-all mt-2.5 w-fit"
              >
                Shop All Dresses
              </Link>
            </div>
          </div>

          {/* Section 2: SETS & SPECIAL EDITS */}
          <div>
            <h3 className="font-jost text-xs font-semibold uppercase tracking-[0.2em] text-[#231f20]/70 mb-3 block">
              Sets & Special Edits
            </h3>
            <div className="flex flex-col space-y-2">
              <Link
                href="/products/co-ord-sets"
                onClick={onClose}
                className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300 w-fit"
              >
                Co-ord Sets
              </Link>
              <Link
                href="/products/tie-n-dye"
                onClick={onClose}
                className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300 w-fit"
              >
                Tie n Dye
              </Link>
              <Link
                href="/collections/co-ord-sets"
                onClick={onClose}
                className="inline-block border-b border-[#231f20]/40 pb-0.5 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-[#231f20] hover:border-[#231f20] hover:opacity-75 transition-all mt-2.5 w-fit"
              >
                Shop Co-ord Sets
              </Link>
              <Link
                href="/collections/tie-n-dye"
                onClick={onClose}
                className="inline-block border-b border-[#231f20]/40 pb-0.5 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-[#231f20] hover:border-[#231f20] hover:opacity-75 transition-all mt-2 w-fit"
              >
                Shop Tie & Dye
              </Link>
            </div>
          </div>

          {/* Section 3: ACCESSORIES */}
          <div>
            <h3 className="font-jost text-xs font-semibold uppercase tracking-[0.2em] text-[#231f20]/70 mb-3 block">
              Accessories
            </h3>
            <div className="flex flex-col space-y-2">
              <Link
                href="/products/blue-bag"
                onClick={onClose}
                className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300 w-fit"
              >
                Blue Bag
              </Link>
              <Link
                href="/products/pink-bag"
                onClick={onClose}
                className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300 w-fit"
              >
                Pink Bag
              </Link>
              <Link
                href="/collections/accessories"
                onClick={onClose}
                className="inline-block border-b border-[#231f20]/40 pb-0.5 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-[#231f20] hover:border-[#231f20] hover:opacity-75 transition-all mt-2.5 w-fit"
              >
                Shop Accessories
              </Link>
            </div>
          </div>

          {/* Section 4: OUR WORLD */}
          <div>
            <h3 className="font-jost text-xs font-semibold uppercase tracking-[0.2em] text-[#231f20]/70 mb-3 block">
              Our World
            </h3>
            <div className="flex flex-col space-y-2">
              <Link
                href="/philosophy"
                onClick={onClose}
                className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300 w-fit"
              >
                Our Philosophy
              </Link>
              <Link
                href="/sustainability"
                onClick={onClose}
                className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300 w-fit"
              >
                Sustainability & Care
              </Link>
              <Link
                href="/journal"
                onClick={onClose}
                className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300 w-fit"
              >
                The Journal
              </Link>
            </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="px-8 py-6 border-t border-[#231f20]/10 shrink-0 bg-[#f6f1e8]/80 backdrop-blur-xs flex items-center justify-between text-[10px] text-[#231f20]/60 uppercase tracking-widest font-jost">
          <span>Crafted Consciously</span>
          <span>100% Linen</span>
        </div>
      </aside>
    </div>,
    document.body
  );
}
