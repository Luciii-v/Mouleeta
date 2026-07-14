'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MegaMenuProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}

export default function MegaMenu({
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: MegaMenuProps) {
  return (
    <>
      {/* Dark, semi-transparent backdrop overlay below the menu (`h-[200vh] w-screen`) to trap user focus */}
      <div
        className={`fixed inset-x-0 top-full h-[200vh] w-screen bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isOpen ? 'opacity-100 pointer-events-auto z-30' : 'opacity-0 pointer-events-none -z-10'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Full-width Mega Menu panel */}
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`absolute top-full left-0 w-full bg-[#f6f1e8] text-[#231f20] border-b border-[#231f20]/10 shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto z-50'
            : 'opacity-0 -translate-y-3 pointer-events-none -z-10'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-12 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left Side: Categories Grid (9 columns) */}
          <div className="col-span-12 md:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            
            {/* Column 1: DRESSES */}
            <div className="flex flex-col">
              <h3 className="font-jost text-xs font-semibold tracking-[0.2em] text-[#231f20]/70 uppercase mb-4 block">
                Dresses
              </h3>
              <div className="flex flex-col space-y-1">
                <Link
                  href="/products/collar-dress"
                  onClick={onClose}
                  className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300 block py-1"
                >
                  Collar Dress
                </Link>
                <Link
                  href="/products/backless-dress"
                  onClick={onClose}
                  className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300 block py-1"
                >
                  Backless Dress
                </Link>
                <Link
                  href="/products/slit-dress"
                  onClick={onClose}
                  className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300 block py-1"
                >
                  Slit Dress
                </Link>
                <Link
                  href="/products/short-dress"
                  onClick={onClose}
                  className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300 block py-1"
                >
                  Short Dress
                </Link>
                <Link
                  href="/collections/dresses"
                  onClick={onClose}
                  className="inline-block border-b border-[#231f20]/40 pb-0.5 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-[#231f20] hover:border-[#231f20] hover:opacity-75 transition-all mt-3 w-fit"
                >
                  Shop All Dresses
                </Link>
              </div>
            </div>

            {/* Column 2: SETS & SPECIAL EDITS */}
            <div className="flex flex-col">
              <h3 className="font-jost text-xs font-semibold tracking-[0.2em] text-[#231f20]/70 uppercase mb-4 block">
                Sets & Special Edits
              </h3>
              <div className="flex flex-col space-y-1">
                <Link
                  href="/products/co-ord-sets"
                  onClick={onClose}
                  className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300 block py-1"
                >
                  Co-ord Sets
                </Link>
                <Link
                  href="/products/tie-n-dye"
                  onClick={onClose}
                  className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300 block py-1"
                >
                  Tie n Dye
                </Link>
                <Link
                  href="/collections/co-ord-sets"
                  onClick={onClose}
                  className="inline-block border-b border-[#231f20]/40 pb-0.5 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-[#231f20] hover:border-[#231f20] hover:opacity-75 transition-all mt-3 w-fit"
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

            {/* Column 3: ACCESSORIES */}
            <div className="flex flex-col">
              <h3 className="font-jost text-xs font-semibold tracking-[0.2em] text-[#231f20]/70 uppercase mb-4 block">
                Accessories
              </h3>
              <div className="flex flex-col space-y-1">
                <Link
                  href="/products/blue-bag"
                  onClick={onClose}
                  className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300 block py-1"
                >
                  Blue Bag
                </Link>
                <Link
                  href="/products/pink-bag"
                  onClick={onClose}
                  className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300 block py-1"
                >
                  Pink Bag
                </Link>
                <Link
                  href="/collections/accessories"
                  onClick={onClose}
                  className="inline-block border-b border-[#231f20]/40 pb-0.5 font-inter text-[11px] font-semibold uppercase tracking-[0.15em] text-[#231f20] hover:border-[#231f20] hover:opacity-75 transition-all mt-3 w-fit"
                >
                  Shop Accessories
                </Link>
              </div>
            </div>

            {/* Column 4: OUR WORLD */}
            <div className="flex flex-col">
              <h3 className="font-jost text-xs font-semibold tracking-[0.2em] text-[#231f20]/70 uppercase mb-4 block">
                Our World
              </h3>
              <div className="flex flex-col space-y-1">
                <Link
                  href="/philosophy"
                  onClick={onClose}
                  className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300 block py-1"
                >
                  Our Philosophy
                </Link>
                <Link
                  href="/sustainability"
                  onClick={onClose}
                  className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300 block py-1"
                >
                  Sustainability & Care
                </Link>
                <Link
                  href="/journal"
                  onClick={onClose}
                  className="font-inter text-sm font-light text-[#231f20] hover:text-black hover:translate-x-1.5 transition-all duration-300 block py-1"
                >
                  The Journal
                </Link>
              </div>
            </div>

          </div>

          {/* Right Side: Atmospheric Campaign Feature (3 columns) */}
          <div className="col-span-12 md:col-span-3 flex flex-col justify-between">
            <Link
              href="/shop"
              onClick={onClose}
              className="relative aspect-[3/4] w-full bg-[#ebe4d8] overflow-hidden group/card border border-[#231f20]/10 block shadow-sm"
            >
              <Image
                src="/sustainability-macro.png"
                alt="Mouleeta Campaign Detail"
                fill
                sizes="(max-width: 768px) 100vw, 350px"
                className="object-cover transition-transform duration-1000 group-hover/card:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-500 group-hover/card:opacity-90" />
              <div className="absolute bottom-6 left-6 right-6 text-bone">
                <p className="text-[9px] uppercase tracking-[0.25em] opacity-80 font-metropolis">
                  Summer 2026 / The Archive
                </p>
                <h4 className="text-sm uppercase tracking-[0.2em] font-light font-jost mt-1">
                  Explore Editorial
                </h4>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
