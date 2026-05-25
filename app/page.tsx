'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // Parallax scroll effect for Hero Image
    const handleScroll = () => {
      setScrollOffset(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for Scroll Reveal Animations
  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Reveal once
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    const revealElements = document.querySelectorAll('.reveal-up');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [mounted]);

  return (
    <div
      className={`transition-all duration-[1000ms] cubic-bezier(0.22, 1, 0.36, 1) ${
        mounted ? 'opacity-100 translate-y-0 filter-none' : 'opacity-0 translate-y-4 blur-[2px]'
      }`}
    >
      {/* 1. Cinematic Parallax Editorial Hero Cover Section */}
      <section
        ref={heroRef}
        className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-bone-surface select-none"
      >
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img
            alt="Mouleeta editorial shot featuring a model in flowing unbleached linen garments"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfImlbgnObmisRKp23t9s1o20iU3dwIxX6G-ecD_Ng7Ejd-XczO8eupjpvwaLkfY93mCg77WB-8UuCKR7vHjyuSaNxobfTwYjbhQMOJB1rgg8tPV4ozhVf-aZkRxN-mNRg7mHfcKI2fPZQFDdTTBjbn368JcLob06Eo1e75b5c7qdPThqArwWKFDznyXAKxFxlnKBaOTUbeVnyOmEwR0Vbei_BtTu__h4dXMWi2kvdZ8puWwzv-ZW5JPU-6RnnMpvW-OWgxzq5vb4"
            className="w-full h-full object-cover object-center opacity-90 scale-110 origin-bottom transition-transform duration-100"
            style={{
              transform: `translateY(${scrollOffset * 0.4}px) scale(1.15)`,
            }}
          />
          {/* Vignette editorial backdrop shade */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-primary/45 mix-blend-multiply" />
        </div>

        {/* Content Details Block */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-margin-mobile md:px-margin-desktop max-w-[1440px] w-full">
          <h1 className="font-metropolis text-[42px] leading-[48px] sm:text-[64px] sm:leading-[72px] md:text-[84px] md:leading-[92px] font-light text-on-primary shimmer-text-light uppercase tracking-[0.2em] mb-6 text-center">
            Crafted<br />Consciously
          </h1>
          <p className="font-libre-franklin text-sm md:text-base text-on-primary/80 max-w-md mx-auto mb-10 leading-relaxed tracking-wider">
            An architectural study in wear. 100% pure linen silhouettes designed for the modern minimalist.
          </p>
          <a
            href="#collection"
            className="inline-flex items-center justify-center px-8 py-4 bg-on-primary text-primary font-libre-franklin text-[12px] font-semibold uppercase tracking-[0.2em] hover:bg-bone-surface hover:text-onyx-foreground transition-all duration-300 shadow-sm outline-none border border-transparent select-none cursor-pointer"
          >
            Explore The Collection
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-10 opacity-70">
          <span className="font-libre-franklin text-[10px] font-semibold uppercase tracking-[0.15em] text-on-primary mb-2 opacity-60">
            Scroll
          </span>
          <svg
            className="w-4 h-4 text-on-primary font-light opacity-60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* 2. Bento-style Editorial Grid Section */}
      <section
        id="collection"
        className="py-section-gap max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop scroll-mt-20"
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-onyx-foreground/10 pb-6">
          <div>
            <span className="font-libre-franklin text-[11px] font-bold uppercase tracking-[0.25em] text-graphite-muted block mb-2">
              The Archive — Issue I
            </span>
            <h2 className="font-metropolis text-3xl md:text-5xl font-light text-onyx-foreground tracking-wide leading-none">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/product/architects-tunic"
            className="font-libre-franklin text-[12px] font-semibold uppercase tracking-[0.15em] text-graphite-muted hover:text-onyx-foreground transition-colors duration-300 flex items-center gap-2 mt-4 md:mt-0 group"
          >
            View All
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-stretch">
          
          {/* Large Main Feature Card (Cols 1-7) */}
          <Link
            href="/product/architects-tunic"
            className="md:col-span-7 flex flex-col group cursor-pointer reveal-up transition-opacity duration-300 outline-none"
          >
            <div className="relative overflow-hidden bg-bone-surface aspect-[4/5] w-full mb-4">
              <img
                alt="Model wearing The Architectural Blazer in Oatmeal linen"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBerHu837ZyHnxMha3RDwurvS1eRSAP9KaVnQz1jpNYAOwQcG9p-bFyR4i-8uvqahcBCSW7F2rymL--lzhAwSxONCKxylKvuWl5wOLw-EXVKn1XcdG2VTXuJNbkx6zpQiefhrkzHuHopf8HJeFd-Ar3jfJTec_eofHs9LG0UHLoNc2ffR2buq64H4jV0kb5PM5YkJ36kfr2V0ELNFMPT9xqxIc2U2NMTTFwRnI7e97Qp2NtWjvfa6MzfjOHHH4dmZOkyzweTbfvjjw"
                className="w-full h-full object-cover object-center transition-transform duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 border border-onyx-foreground/10 px-3 py-1 bg-bone-surface/90 backdrop-blur-xs select-none">
                <span className="font-libre-franklin text-[10px] font-bold tracking-[0.2em] text-onyx-foreground uppercase">
                  100% Linen
                </span>
              </div>
            </div>
            <div className="flex justify-between items-start w-full px-1">
              <div>
                <h3 className="font-libre-franklin text-[15px] font-bold text-onyx-foreground mb-1 group-hover:opacity-75 transition-opacity">
                  The Architectural Blazer
                </h3>
                <p className="font-libre-franklin text-[11px] font-semibold uppercase tracking-[0.15em] text-graphite-muted">
                  Oatmeal
                </p>
              </div>
              <span className="font-libre-franklin text-base font-medium text-onyx-foreground">$450</span>
            </div>
          </Link>

          {/* Asymmetric Side Stack Card (Cols 8-12) */}
          <div className="md:col-span-5 flex flex-col gap-gutter justify-between">
            
            {/* Trousers Card (Square) */}
            <Link
              href="/product/architects-tunic"
              className="group cursor-pointer flex flex-col reveal-up transition-opacity duration-300 outline-none"
              style={{ transitionDelay: '150ms' }}
            >
              <div className="relative overflow-hidden bg-bone-surface aspect-square w-full mb-4">
                <img
                  alt="Detail shot of unbleached linen fabric"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYcGcJjhVGqdyvOe5mrhPrzGq6g8E7EXVTVbpvype4RWPxxxumZOixkHePc0ln-GLGYRYJ0IS75-XT_zXGmRq0w8OKOyZQG3SeVDW3ldpDz46y_LuBZOvWw3j6eaBLBjupUwpU7ftgQA9nGIzoJk2deNcc3k0nHFB4bDC8BjY9fyx2MKYWC-w2AQmEdICd3SunoIQvghGWltKxIPY3V5v0ltJ7eSnAPMaijh33n5KWoCyjFqUP72QWwEdxMBjcrHGJnotLd5018hg"
                  className="w-full h-full object-cover object-center transition-transform duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-start w-full px-1">
                <div>
                  <h3 className="font-libre-franklin text-[15px] font-bold text-onyx-foreground mb-1 group-hover:opacity-75 transition-opacity">
                    Structured Trousers
                  </h3>
                  <p className="font-libre-franklin text-[11px] font-semibold uppercase tracking-[0.15em] text-graphite-muted">
                    Onyx Black
                  </p>
                </div>
                <span className="font-libre-franklin text-base font-medium text-onyx-foreground">$280</span>
              </div>
            </Link>

            {/* Tunic Card (Wide) */}
            <Link
              href="/product/architects-tunic"
              className="group cursor-pointer flex flex-col reveal-up transition-opacity duration-300 mt-8 md:mt-0 outline-none"
              style={{ transitionDelay: '300ms' }}
            >
              <div className="relative overflow-hidden bg-bone-surface aspect-[16/10] w-full mb-4">
                <img
                  alt="Flat lay photograph of folded minimalist tunic dress"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzjhmUtwVXkK0Jd6sphSbfyKzmL9qe_bCTi0xqxr6UzxN_mv_KjGVzCnnUAWjPGk6fvqtS8r3PfH31myjhM2kYksPtK-Ap2qHe1awWwF6SNFsxkb3oRoswYYMls8BzraNwUXEU0TvGJL5Uj62TWMkA8uBoSrExPweoW9mcIcbp1cNbafqwtOkXaYDAHrkRuPl6nEjbIy1Me4eszbQdC1E0KWWYagnCp6Whp5gNxMf5c0B7rIqphKx20yrb83E8a2mZmUXti5c66zc"
                  className="w-full h-full object-cover object-center transition-transform duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-start w-full px-1">
                <div>
                  <h3 className="font-libre-franklin text-[15px] font-bold text-onyx-foreground mb-1 group-hover:opacity-75 transition-opacity">
                    Flow Tunic
                  </h3>
                  <p className="font-libre-franklin text-[11px] font-semibold uppercase tracking-[0.15em] text-graphite-muted">
                    Raw Canvas
                  </p>
                </div>
                <span className="font-libre-franklin text-base font-medium text-onyx-foreground">$320</span>
              </div>
            </Link>

          </div>

        </div>
      </section>

      {/* 3. Narrative Sustainability Block */}
      <section className="bg-bone-surface py-28 border-t border-onyx-foreground/5 relative overflow-hidden select-none">
        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <span className="font-libre-franklin text-[11px] font-bold uppercase tracking-[0.25em] text-graphite-muted block mb-4">
            Our Promise
          </span>
          <h2 className="font-metropolis text-2xl sm:text-4xl md:text-5xl font-light text-onyx-foreground tracking-wide leading-tight max-w-3xl mx-auto mb-8">
            Treating fashion as architectural art. Durable, sustainable, consciously sourced.
          </h2>
          <Link
            href="/product/architects-tunic"
            className="font-libre-franklin text-[12px] font-semibold uppercase tracking-[0.15em] text-onyx-foreground border-b border-onyx-foreground pb-1 hover:opacity-60 transition-opacity duration-300"
          >
            Discover Our Manifesto
          </Link>
        </div>
      </section>
    </div>
  );
}
