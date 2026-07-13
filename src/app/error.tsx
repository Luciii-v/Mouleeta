'use client';

import { useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry or Crashlytics
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#F9F8F6] text-center select-none">
      <div className="w-16 h-16 mb-8 rounded-full bg-red-50 flex items-center justify-center">
        <ShieldCheck className="w-8 h-8 text-red-500" strokeWidth={1.5} />
      </div>
      
      <h2 className="font-jost text-3xl md:text-4xl font-light text-[#1A1A1A] tracking-[0.1em] uppercase mb-4">
        Something went wrong
      </h2>
      
      <p className="font-inter text-[#1A1A1A]/60 max-w-md mx-auto mb-10 leading-relaxed text-sm">
        We apologize for the inconvenience. An unexpected error occurred while loading this page. Our team has been notified.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <button
          onClick={() => reset()}
          className="bg-[#1A1A1A] text-[#FDFBF7] font-metropolis font-light text-[10px] uppercase tracking-[0.2em] px-8 py-4 hover:bg-stone-800 transition-all duration-300 w-full sm:w-auto"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="bg-transparent text-[#1A1A1A] border border-[#1A1A1A]/20 font-metropolis font-light text-[10px] uppercase tracking-[0.2em] px-8 py-4 hover:bg-[#1A1A1A]/5 transition-all duration-300 w-full sm:w-auto text-center"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
