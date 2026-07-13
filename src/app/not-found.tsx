import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f6f1e8] flex flex-col items-center justify-center px-6 text-center">
      {/* Decorative number */}
      <p className="font-jost font-extralight text-[120px] md:text-[180px] leading-none tracking-[0.15em] text-[#1A1A1A]/5 select-none">
        404
      </p>

      {/* Title */}
      <h1 className="font-jost font-light text-2xl md:text-3xl tracking-[0.2em] uppercase text-[#1A1A1A] -mt-6 md:-mt-10 mb-4">
        Page Not Found
      </h1>

      {/* Decorative line */}
      <span className="block w-12 h-[1px] bg-[#1A1A1A]/20 mb-8" />

      {/* Description */}
      <p className="font-inter font-light text-sm tracking-wide leading-loose text-[#1A1A1A]/60 max-w-md mb-12">
        The page you are looking for may have been moved, removed, or perhaps never existed. Let us guide you back.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#1A1A1A] text-[#FDFBF7] font-jost text-[11px] uppercase tracking-[0.2em] px-10 py-4 hover:bg-stone-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Return Home
        </Link>

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 border border-[#1A1A1A]/20 text-[#1A1A1A] font-jost text-[11px] uppercase tracking-[0.2em] px-10 py-4 hover:border-[#1A1A1A] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
