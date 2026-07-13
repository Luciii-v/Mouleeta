import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function MegaMenu() {
  return (
    <div className="w-full bg-[#f6f1e8] border-b border-onyx/5 text-onyx shadow-sm transition-all duration-500 ease-in-out">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-12 grid grid-cols-1 md:grid-cols-5 gap-12">
        
        {/* Column 1: Dresses */}
        <div className="flex flex-col space-y-5">
          <h3 className="text-[11px] font-medium tracking-[0.2em] text-stone-500 uppercase">Dresses</h3>
          <div className="flex flex-col space-y-3 text-[13px] font-normal tracking-wide text-stone-600">
            <Link href="/products/collar-dress" className="hover:text-black hover:translate-x-1 transition-all duration-300 w-fit">Collar Dress</Link>
            <Link href="/products/backless-dress" className="hover:text-black hover:translate-x-1 transition-all duration-300 w-fit">Backless Dress</Link>
            <Link href="/products/slit-dress" className="hover:text-black hover:translate-x-1 transition-all duration-300 w-fit">Slit Dress</Link>
            <Link href="/products/short-dress" className="hover:text-black hover:translate-x-1 transition-all duration-300 w-fit">Short Dress</Link>
            <Link href="/collections/dresses" className="hover:text-black text-[11px] underline tracking-wider uppercase font-medium pt-2 w-fit">Shop All Dresses</Link>
          </div>
        </div>

        {/* Column 2: Co-ords & Tie n Dye */}
        <div className="flex flex-col space-y-5">
          <div>
            <h3 className="text-[11px] font-medium tracking-[0.2em] text-stone-500 uppercase mb-5">Sets & Special Edits</h3>
            <div className="flex flex-col space-y-3 text-[13px] font-normal tracking-wide text-stone-600">
              <Link href="/products/co-ord-sets" className="hover:text-black hover:translate-x-1 transition-all duration-300 w-fit">Co-ord Sets</Link>
              <Link href="/products/tie-n-dye" className="hover:text-black hover:translate-x-1 transition-all duration-300 w-fit">Tie n Dye</Link>
              <Link href="/collections/co-ord-sets" className="hover:text-black text-[11px] underline tracking-wider uppercase font-medium pt-2 w-fit">Shop Co-ord Sets</Link>
              <Link href="/collections/tie-n-dye" className="hover:text-black text-[11px] underline tracking-wider uppercase font-medium w-fit">Shop Tie & Dye</Link>
            </div>
          </div>
        </div>

        {/* Column 3: Accessories */}
        <div className="flex flex-col space-y-5">
          <h3 className="text-[11px] font-medium tracking-[0.2em] text-stone-500 uppercase">Accessories</h3>
          <div className="flex flex-col space-y-3 text-[13px] font-normal tracking-wide text-stone-600">
            <Link href="/products/blue-bag" className="hover:text-black hover:translate-x-1 transition-all duration-300 w-fit">Blue Bag</Link>
            <Link href="/products/pink-bag" className="hover:text-black hover:translate-x-1 transition-all duration-300 w-fit">Pink Bag</Link>
            <Link href="/collections/accessories" className="hover:text-black text-[11px] underline tracking-wider uppercase font-medium pt-2 w-fit">Shop Accessories</Link>
          </div>
        </div>

        {/* Column 4: The Brand */}
        <div className="flex flex-col space-y-5">
          <h3 className="text-[11px] font-medium tracking-[0.2em] text-stone-500 uppercase">Our World</h3>
          <div className="flex flex-col space-y-3 text-[13px] font-normal tracking-wide text-stone-600">
            <Link href="/philosophy" className="hover:text-black hover:translate-x-1 transition-all duration-300 w-fit">Our Philosophy</Link>
            <Link href="/sustainability" className="hover:text-black hover:translate-x-1 transition-all duration-300 w-fit">Sustainability & Care</Link>
            <Link href="/journal" className="hover:text-black hover:translate-x-1 transition-all duration-300 w-fit">The Journal</Link>
          </div>
        </div>

        {/* Column 5: Visual/Editorial Feature */}
        <Link href="/shop" className="relative aspect-[4/3] w-full bg-[#F5EFE7]/80 overflow-hidden group/menu-img border border-onyx/5 block">
          <Image
            src="/sustainability-macro.png"
            alt="Linen Texture Detail"
            fill
            sizes="300px"
            className="object-cover transition-transform duration-1000 group-hover/menu-img:scale-105"
          />
          <div className="absolute inset-0 bg-onyx/15 transition-colors duration-500 group-hover/menu-img:bg-onyx/25" />
          <div className="absolute bottom-4 left-4 text-bone">
            <p className="text-[9px] uppercase tracking-[0.2em] opacity-80 font-metropolis">Summer 2026</p>
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-light font-jost mt-0.5">Explore Outfits</h4>
          </div>
        </Link>

      </div>
    </div>
  );
}
