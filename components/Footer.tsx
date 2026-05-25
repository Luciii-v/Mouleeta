'use client';

import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 5000);
    }
  };

  return (
    <footer className="bg-bone-surface w-full py-section-gap border-t border-onyx-foreground/10 transition-colors duration-500">
      <div className="grid grid-cols-1 md:grid-cols-12 max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop gap-gutter items-start">
        
        {/* Brand Column (Cols 1-4) */}
        <div className="md:col-span-4 flex flex-col gap-6 mb-12 md:mb-0">
          <div className="flex items-center gap-3.5 select-none">
            <img
              src="/logo.svg"
              alt="Mouleeta Logo"
              className="h-8.5 w-auto object-contain mix-blend-multiply"
            />
            <span className="font-metropolis text-base font-light tracking-[0.25em] text-[#231f20] uppercase">
              MOULEETA
            </span>
          </div>
          <p className="font-libre-franklin text-[11px] font-semibold uppercase tracking-[0.15em] text-graphite-muted leading-relaxed max-w-xs">
            AN ARCHITECTURAL STUDY IN WEAR.<br />
            CRAFTED FOR PERMANENCE.
          </p>
        </div>

        {/* Explore Links Column (Cols 7-8) */}
        <div className="md:col-span-2 md:col-start-7 flex flex-col gap-6 mb-8 md:mb-0">
          <h4 className="font-libre-franklin text-[12px] font-bold uppercase tracking-[0.2em] text-onyx-foreground/50">
            Explore
          </h4>
          <div className="flex flex-col gap-4">
            <a
              href="#"
              className="font-libre-franklin text-[12px] font-semibold uppercase tracking-[0.15em] text-graphite-muted hover:text-onyx-foreground transition-all duration-300"
            >
              Sustainability
            </a>
            <a
              href="#"
              className="font-libre-franklin text-[12px] font-semibold uppercase tracking-[0.15em] text-graphite-muted hover:text-onyx-foreground transition-all duration-300"
            >
              Care Guide
            </a>
          </div>
        </div>

        {/* Support Links Column (Cols 9-10) */}
        <div className="md:col-span-2 flex flex-col gap-6 mb-8 md:mb-0">
          <h4 className="font-libre-franklin text-[12px] font-bold uppercase tracking-[0.2em] text-onyx-foreground/50">
            Support
          </h4>
          <div className="flex flex-col gap-4">
            <a
              href="#"
              className="font-libre-franklin text-[12px] font-semibold uppercase tracking-[0.15em] text-graphite-muted hover:text-onyx-foreground transition-all duration-300"
            >
              Shipping & Returns
            </a>
            <a
              href="#"
              className="font-libre-franklin text-[12px] font-semibold uppercase tracking-[0.15em] text-graphite-muted hover:text-onyx-foreground transition-all duration-300"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Newsletter Column (Cols 10-12) */}
        <div className="md:col-span-3 flex flex-col gap-6 w-full">
          <h4 className="font-libre-franklin text-[12px] font-bold uppercase tracking-[0.2em] text-onyx-foreground/50">
            Newsletter
          </h4>
          <p className="font-libre-franklin text-[13px] text-graphite-muted leading-relaxed">
            Subscribe for intimate brand updates, collections, and early access.
          </p>

          <form onSubmit={handleSubmit} className="relative w-full border-b border-onyx-foreground/20 pb-2 flex items-center">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isSubmitted ? "THANK YOU FOR JOINING" : "YOUR EMAIL ADDRESS"}
              className="w-full bg-transparent border-0 outline-none p-0 font-libre-franklin text-[11px] font-bold tracking-[0.15em] text-onyx-foreground placeholder:text-graphite-muted/40 focus:ring-0 focus:border-transparent select-all"
              disabled={isSubmitted}
            />
            {!isSubmitted && (
              <button
                type="submit"
                aria-label="Subscribe"
                className="font-libre-franklin text-[11px] font-bold tracking-[0.15em] text-onyx-foreground hover:opacity-60 transition-opacity pl-2 cursor-pointer"
              >
                JOIN
              </button>
            )}
          </form>
        </div>

        {/* Bottom copyright details and Social integrations */}
        <div className="md:col-span-12 mt-24 pt-8 border-t border-onyx-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4 w-full">
          <span className="font-libre-franklin text-[11px] font-semibold uppercase tracking-[0.15em] text-graphite-muted text-center md:text-left select-none">
            © {new Date().getFullYear()} MOULEETA. AN ARCHITECTURAL STUDY IN WEAR.
          </span>
          <div className="flex gap-6">
            <a
              href="#"
              className="font-libre-franklin text-[11px] font-semibold uppercase tracking-[0.15em] text-graphite-muted hover:text-onyx-foreground transition-colors duration-300"
            >
              Instagram
            </a>
            <a
              href="#"
              className="font-libre-franklin text-[11px] font-semibold uppercase tracking-[0.15em] text-graphite-muted hover:text-onyx-foreground transition-colors duration-300"
            >
              Pinterest
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
