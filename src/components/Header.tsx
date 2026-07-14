'use client';

import React, { useState } from 'react';
import { Search, User, Heart, Truck, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useSession, signOut } from "next-auth/react";
import { usePathname } from 'next/navigation';
import ShopDrawer from './ShopDrawer';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import SearchModal from './SearchModal';

export default function Header() {
  const { data: session, status } = useSession();
  const { cart, openCart } = useCartStore();
  const { wishlist } = useWishlistStore();
  const [mounted, setMounted] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // Calculate the total number of physical items (accounting for quantities)
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const isHome = pathname === '/';
  // It's only transparent if we are at the top of the home page AND not hovering the shop menu or drawer
  const isTransparent = isHome && !isScrolled && !isMenuOpen;

  // Determine colors based on transparency
  const textColorClass = isTransparent ? "text-white/80 hover:text-white" : "text-graphite hover:text-onyx";
  const iconColorClass = isTransparent ? "text-white hover:text-white/80" : "text-onyx hover:opacity-60";

  return (
    <header 
      className={`fixed top-0 z-40 w-full transition-colors duration-500 ease-out select-none ${
        isTransparent 
          ? 'bg-transparent border-b border-transparent py-2' 
          : 'bg-[#f6f1e8]/95 backdrop-blur-md border-b border-onyx/10 py-0 shadow-[0_4px_30px_rgba(0,0,0,0.02)]'
      }`}
    >

      <div className="max-w-[1440px] mx-auto px-6 md:px-16 flex items-center justify-between">

        {/* Left: Navigation links (w-1/3) */}
        <nav className="w-1/3 flex items-center justify-start gap-8 hidden md:flex">
          {/* Shop with Left-Side Drawer Trigger */}
          <div>
            <button
              onClick={() => setIsMenuOpen(true)}
              className={`font-inter text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors cursor-pointer py-6 ${textColorClass}`}
            >
              Shop
            </button>
          </div>

          <Link
            href="#collection"
            className={`font-inter text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors py-6 ${textColorClass}`}
          >
            Collection
          </Link>
          <Link
            href="#commitment"
            className={`font-inter text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors py-6 ${textColorClass}`}
          >
            About
          </Link>
          <Link
            href="#philosophy"
            className={`font-inter text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors py-6 ${textColorClass}`}
          >
            Sustainability
          </Link>
        </nav>



        {/* Mobile menu toggle */}
        <div className="w-1/3 flex items-center justify-start md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`p-1 cursor-pointer transition-colors ${iconColorClass}`}
            aria-label="Open navigation menu"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Center: Brand Logo and Name perfectly centered (w-1/3) */}
        <div className="w-1/3 flex flex-col items-center justify-center">
          <Link href="/" className="flex flex-col items-center justify-center group gap-1">
            {/* Crown Logo - aspect ratio 1.55 (688x444), scaled up for high visibility */}
            <motion.div
              style={{ perspective: 1000 }}
              className="relative w-16 h-10 md:w-20 md:h-13 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
              initial={{ opacity: 0, rotateY: 360, y: 20 }}
              animate={{ opacity: 1, rotateY: 0, y: 0 }}
              transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src="/logo.svg"
                alt="Mouleeta Crown"
                fill
                priority
                className="object-contain"
              />
            </motion.div>
            <h1 className={`font-jost font-light tracking-[0.25em] text-[12px] md:text-[13px] uppercase mt-0.5 flex items-center justify-center transition-colors duration-500 ${isTransparent ? 'text-white' : 'text-onyx'}`}>
              <motion.span
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="inline-block"
              >
                MOUL
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="inline-block"
              >
                EETA
              </motion.span>
            </h1>
          </Link>
        </div>

        {/* Right: Icons (w-1/3) aligned right */}
        <div className="w-1/3 flex items-center justify-end gap-5 md:gap-7">
          
          <motion.button
            layoutId="search-island"
            onClick={() => setIsSearchOpen(true)}
            style={{ borderRadius: 9999 }}
            className={`transition-opacity p-2 cursor-pointer flex items-center justify-center ${iconColorClass}`}
            aria-label="Search"
          >
            <motion.div layoutId="search-icon">
              <Search size={18} strokeWidth={1.5} />
            </motion.div>
          </motion.button>

          {status === 'authenticated' ? (
            <div className="group relative cursor-pointer p-1">
              {/* Google Profile Picture with Fallback */}
              {session?.user?.image ? (
                <Image 
                  src={session.user.image} 
                  alt="Profile" 
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-full object-cover border border-stone-300 shadow-sm"
                  unoptimized
                  onError={(e) => {
                    // If Google's image fails or is blocked, instantly swap to a sleek custom initial
                    e.currentTarget.onerror = null; 
                    e.currentTarget.srcset = '';
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${session?.user?.name || 'U'}&background=1c1917&color=fff&font-size=0.4`;
                  }}
                />
              ) : (
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-stone-900 text-white text-[10px] font-bold uppercase shadow-sm">
                  {session?.user?.name?.charAt(0) || 'U'}
                </div>
              )}

              {/* Hover Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#F9F8F6] shadow-xl border border-stone-200 hidden group-hover:block p-5 animate-fadeIn text-stone-900">
                <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Signed in as</p>
                <p className="text-xs text-stone-800 mb-4 truncate font-light">{session?.user?.email}</p>
                <button
                  onClick={() => signOut()}
                  className="text-[11px] uppercase tracking-widest text-stone-900 hover:text-stone-500 transition-colors w-full text-left cursor-pointer font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/account/login"
              className={`transition-opacity p-1 cursor-pointer ${iconColorClass}`}
              aria-label="Account"
            >
              <User size={18} strokeWidth={1.5} />
            </Link>
          )}

          {/* Order Tracking Icon */}
          <Link
            href="/track"
            className={`transition-opacity p-2 cursor-pointer ${iconColorClass}`}
            aria-label="Track Order & Returns"
            title="Track Order & Returns"
          >
            <Truck size={18} strokeWidth={1.5} />
          </Link>

          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            className={`relative p-2 transition-opacity flex items-center justify-center cursor-pointer ${iconColorClass}`}
            aria-label="Wishlist"
            title="Mouleeta Privé Wishlist"
          >
            <Heart size={18} strokeWidth={1.5} className={mounted && wishlist.length > 0 ? "fill-red-600 text-red-600" : ""} />
            {mounted && wishlist.length > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-[8px] font-bold text-white bg-red-600 rounded-full transform translate-x-1/4 -translate-y-1/4 shadow-sm">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Dynamic Cart Button */}
          <button
            onClick={openCart}
            className={`relative p-2 transition-colors flex items-center justify-center cursor-pointer ${iconColorClass}`}
            aria-label="Open Cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>

            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-stone-900 rounded-full transform translate-x-1/4 -translate-y-1/4 shadow-sm">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dark overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-[150] backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-[320px] bg-[#FAF8F5] z-[160] shadow-2xl flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-6 border-b border-stone-200">
                <span className="font-jost text-xs tracking-[0.2em] uppercase font-bold text-stone-900">MOULEETA</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-900 transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 py-8 flex flex-col gap-6 overflow-y-auto">
                {/* Dresses Section */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-400">Dresses</span>
                  <Link href="/products/collar-dress" onClick={() => setIsMobileMenuOpen(false)} className="font-jost text-sm tracking-wider text-stone-800 hover:text-black">Collar Dress</Link>
                  <Link href="/products/backless-dress" onClick={() => setIsMobileMenuOpen(false)} className="font-jost text-sm tracking-wider text-stone-800 hover:text-black">Backless Dress</Link>
                  <Link href="/products/slit-dress" onClick={() => setIsMobileMenuOpen(false)} className="font-jost text-sm tracking-wider text-stone-800 hover:text-black">Slit Dress</Link>
                  <Link href="/products/short-dress" onClick={() => setIsMobileMenuOpen(false)} className="font-jost text-sm tracking-wider text-stone-800 hover:text-black">Short Dress</Link>
                  <Link href="/collections/dresses" onClick={() => setIsMobileMenuOpen(false)} className="font-inter text-xs text-stone-500 hover:text-black underline mt-0.5">Shop All Dresses</Link>
                </div>

                {/* Co-ord Sets Section */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-400">Co-ord Sets</span>
                  <Link href="/products/co-ord-sets" onClick={() => setIsMobileMenuOpen(false)} className="font-jost text-sm tracking-wider text-stone-800 hover:text-black">Co-ord Sets</Link>
                  <Link href="/collections/co-ord-sets" onClick={() => setIsMobileMenuOpen(false)} className="font-inter text-xs text-stone-500 hover:text-black underline mt-0.5">Shop Co-ord Sets</Link>
                </div>

                {/* Tie n Dye Section */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-400">Tie n Dye</span>
                  <Link href="/products/tie-n-dye" onClick={() => setIsMobileMenuOpen(false)} className="font-jost text-sm tracking-wider text-stone-800 hover:text-black">Tie n Dye</Link>
                  <Link href="/collections/tie-n-dye" onClick={() => setIsMobileMenuOpen(false)} className="font-inter text-xs text-stone-500 hover:text-black underline mt-0.5">Shop Tie & Dye</Link>
                </div>

                {/* Accessories Section */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-400">Accessories</span>
                  <Link href="/products/blue-bag" onClick={() => setIsMobileMenuOpen(false)} className="font-jost text-sm tracking-wider text-stone-800 hover:text-black">Blue Bag</Link>
                  <Link href="/products/pink-bag" onClick={() => setIsMobileMenuOpen(false)} className="font-jost text-sm tracking-wider text-stone-800 hover:text-black">Pink Bag</Link>
                  <Link href="/collections/accessories" onClick={() => setIsMobileMenuOpen(false)} className="font-inter text-xs text-stone-500 hover:text-black underline mt-0.5">Shop Accessories</Link>
                </div>

                {/* About & Philosophy */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-400">Our World</span>
                  <Link href="/philosophy" onClick={() => setIsMobileMenuOpen(false)} className="font-inter text-xs text-stone-600 hover:text-stone-900">Our Philosophy</Link>
                  <Link href="/sustainability" onClick={() => setIsMobileMenuOpen(false)} className="font-inter text-xs text-stone-600 hover:text-stone-900">Sustainability & Care</Link>
                  <Link href="/journal" onClick={() => setIsMobileMenuOpen(false)} className="font-inter text-xs text-stone-600 hover:text-stone-900">The Journal</Link>
                </div>
              </div>

              {/* Bottom Footer inside mobile menu */}
              <div className="border-t border-stone-200 pt-6 flex flex-col gap-4">
                <Link href="/track" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 font-inter text-xs text-stone-800 hover:text-black">
                  <Truck size={16} strokeWidth={1.5} />
                  <span>Track Order & Returns</span>
                </Link>

                {status === 'authenticated' ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      {session?.user?.image ? (
                        <Image 
                          src={session.user.image} 
                          alt="Profile" 
                          width={24}
                          height={24}
                          className="w-6 h-6 rounded-full object-cover border border-stone-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-stone-900 text-white text-[8px] font-bold uppercase">
                          {session?.user?.name?.charAt(0) || 'U'}
                        </div>
                      )}
                      <span className="font-inter text-xs text-stone-800 truncate max-w-[200px]">{session?.user?.email}</span>
                    </div>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        signOut();
                      }}
                      className="font-metropolis text-[9px] uppercase tracking-widest text-left text-red-600 font-bold"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link href="/account/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 font-inter text-xs text-stone-800 hover:text-black">
                    <User size={16} strokeWidth={1.5} />
                    <span>My Account</span>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ShopDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}
