import React, { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

async function SuccessDetails({ searchParams }: PageProps) {
  const { orderId } = await searchParams;

  return (
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto text-center px-6 py-20 select-none">
      {/* Animated Icon Container */}
      <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-8 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
        <CheckCircle2 size={40} strokeWidth={1.5} className="animate-pulse" />
      </div>

      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#1A1A1A]/40 mb-3 block">
        Transaction Complete
      </span>

      <h1 className="font-jost font-light text-3xl sm:text-4xl tracking-[0.15em] text-[#1A1A1A] uppercase leading-none mb-6">
        Order Confirmed
      </h1>

      <div className="w-12 h-[1px] bg-[#1A1A1A]/20 my-6"></div>

      <p className="font-inter text-xs sm:text-sm text-[#1A1A1A]/70 leading-relaxed tracking-wider mb-8 max-w-md">
        Thank you for choosing conscious luxury. Your payment has been securely verified, and your order has been registered in our workshop.
      </p>

      {/* Shopify Order ID Panel */}
      {orderId && (
        <div className="w-full bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 px-6 py-4 mb-10 text-left font-mono">
          <div className="flex justify-between items-center text-xs text-[#1A1A1A]/50 tracking-wider mb-1 uppercase">
            <span>Reference ID</span>
            <span>Status</span>
          </div>
          <div className="flex justify-between items-center text-[13px] text-[#1A1A1A] font-medium tracking-wide">
            <span>#{orderId}</span>
            <span className="text-emerald-600 font-semibold uppercase text-[10px] tracking-widest bg-emerald-50 px-2 py-0.5 border border-emerald-200">Paid</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <Link
          href="/shop"
          className="flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white font-metropolis font-light text-[11px] uppercase tracking-[0.2em] px-8 py-4 transition-all duration-300 w-full sm:w-auto border-none"
        >
          <ShoppingBag size={14} />
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 border border-[#1A1A1A]/15 hover:border-[#1A1A1A]/40 text-[#1A1A1A] font-metropolis font-light text-[11px] uppercase tracking-[0.2em] px-8 py-4 transition-all duration-300 w-full sm:w-auto"
        >
          Return Home
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage({ searchParams }: PageProps) {
  return (
    <>
      <main className="flex-1 flex flex-col justify-center bg-[#F5F0E8] min-h-[70vh]">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-40">
            <span className="font-mono text-xs uppercase tracking-widest text-[#1A1A1A]/50">Loading details...</span>
          </div>
        }>
          <SuccessDetails searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}
