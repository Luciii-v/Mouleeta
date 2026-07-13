'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieConsentToast() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if already consented
    const consented = localStorage.getItem('mouleeta-cookie-consent');
    if (!consented) {
      // Small delay for cinematic effect
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('mouleeta-cookie-consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.8 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-3rem)] max-w-sm bg-[#1A1A1A] text-white p-6 shadow-2xl flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <h4 className="font-jost text-xs uppercase tracking-[0.2em]">Cookie Policy</h4>
            <p className="font-inter text-[11px] text-gray-400 font-light leading-relaxed">
              We use essential cookies to elevate your browsing experience and personalize our editorial content. 
            </p>
          </div>
          <div className="flex gap-3 mt-2">
            <button
              onClick={handleAccept}
              className="flex-1 bg-white text-black font-metropolis text-[9px] tracking-[0.2em] uppercase py-3 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Accept All
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 border border-white/20 text-white font-metropolis text-[9px] tracking-[0.2em] uppercase py-3 hover:border-white transition-colors cursor-pointer"
            >
              Essential Only
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
