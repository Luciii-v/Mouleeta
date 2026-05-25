'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NavBarProps {
  cartCount?: number;
}

export default function NavBar({ cartCount = 1 }: NavBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out bg-[#f6f1e8] ${
        isScrolled
          ? 'py-4 border-b border-onyx-foreground/5 shadow-xs backdrop-blur-md bg-[#f6f1e8]/90'
          : 'py-6 border-b border-onyx-foreground/10'
      }`}
    >
      <div className="flex justify-between items-center max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop w-full relative">
        
        {/* Left Side: Brand Signature (Logo & Wordmark) */}
        <Link href="/" className="flex items-center gap-3.5 shrink-0 group z-10 select-none">
          <img
            src="/logo.svg"
            alt="Mouleeta Logo"
            className="h-8 w-auto object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-102"
          />
          <span className="font-metropolis text-sm font-light tracking-[0.25em] text-[#231f20] uppercase transition-opacity duration-300 group-hover:opacity-80">
            MOULEETA
          </span>
        </Link>

        {/* Absolute Centered: Navigation Links (Web Only) */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 z-0">
          <Link
            href="/"
            className="text-xs font-light tracking-[0.15em] text-[#231f20] uppercase hover:opacity-60 transition-opacity duration-300"
          >
            Collections
          </Link>
          <Link
            href="/product/architects-tunic"
            className="text-xs font-light tracking-[0.15em] text-[#231f20] uppercase hover:opacity-60 transition-opacity duration-300"
          >
            The Archive
          </Link>
          <a
            href="#"
            className="text-xs font-light tracking-[0.15em] text-[#231f20] uppercase hover:opacity-60 transition-opacity duration-300"
          >
            Journal
          </a>
          <a
            href="#"
            className="text-xs font-light tracking-[0.15em] text-[#231f20] uppercase hover:opacity-60 transition-opacity duration-300"
          >
            About
          </a>
        </nav>

        {/* Right Side: Editorial Thin Action Controls */}
        <div className="flex items-center gap-4 text-[#231f20] z-10">
          {/* Search Icon */}
          <button
            aria-label="Search"
            className="flex items-center justify-center p-1.5 hover:opacity-50 transition-opacity duration-300 cursor-pointer"
          >
            <svg
              className="w-4.5 h-4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Account Profile Icon */}
          <button
            aria-label="Account"
            className="hidden md:flex items-center justify-center p-1.5 hover:opacity-50 transition-opacity duration-300 cursor-pointer"
          >
            <svg
              className="w-4.5 h-4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>

          {/* Shopping Bag Icon with Indicator */}
          <button
            aria-label="Shopping Bag"
            className="flex items-center justify-center p-1.5 hover:opacity-50 transition-opacity duration-300 relative cursor-pointer"
          >
            <svg
              className="w-4.5 h-4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#231f20] rounded-full"></span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
            className="md:hidden flex items-center justify-center p-1.5 hover:opacity-50 transition-opacity duration-300 cursor-pointer"
          >
            <svg
              className="w-5.5 h-5.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>

      </div>

      {/* Mobile Drawer (Responsive slide-down) */}
      <div
        className={`fixed inset-x-0 top-0 pt-20 bg-[#f6f1e8] border-b border-onyx-foreground/10 transition-all duration-500 ease-in-out md:hidden z-40 ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
        }`}
      >
        <nav className="flex flex-col gap-5 py-8 px-margin-mobile">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xs font-light tracking-[0.2em] text-[#231f20] uppercase border-b border-onyx-foreground/5 pb-2.5"
          >
            Collections
          </Link>
          <Link
            href="/product/architects-tunic"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xs font-light tracking-[0.2em] text-[#231f20] uppercase border-b border-onyx-foreground/5 pb-2.5"
          >
            The Archive
          </Link>
          <a
            href="#"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xs font-light tracking-[0.2em] text-[#231f20] uppercase border-b border-onyx-foreground/5 pb-2.5"
          >
            Journal
          </a>
          <a
            href="#"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xs font-light tracking-[0.2em] text-[#231f20] uppercase border-b border-onyx-foreground/5 pb-2.5"
          >
            About
          </a>
        </nav>
      </div>

    </header>
  );
}
