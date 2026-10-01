'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';

export default function NetworkStatus() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Run initial check asynchronously to avoid setState during mount (hydration safe)
    const initTimer = setTimeout(() => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setIsOffline(true);
      }
    }, 0);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearTimeout(initTimer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-0 left-0 w-full z-[9999] bg-red-600 text-white shadow-md flex items-center justify-center p-3 gap-3"
        >
          <WifiOff size={16} className="opacity-90" />
          <p className="font-jost text-xs uppercase tracking-[0.1em] font-medium">
            You are offline. Please check your connection.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
