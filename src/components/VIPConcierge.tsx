"use client";
import React from 'react';
import { MessageCircle, Sparkles, ShieldCheck, Clock } from 'lucide-react';

interface VIPConciergeProps {
  productTitle: string;
  productHandle: string;
  className?: string;
}

export default function VIPConcierge({
  productTitle,
  productHandle,
  className = ""
}: VIPConciergeProps) {
  const phoneNumber = "919876543210"; // Mouleeta Atelier VIP desk
  const message = `Hello Mouleeta Atelier, I would like to request personal styling and bespoke sizing consultation for the "${productTitle}" (https://mouleeta.shop/products/${productHandle}).`;
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className={`w-full bg-[#FAF8F5] border border-stone-300/80 p-5 transition-all duration-300 hover:border-stone-400 hover:shadow-md ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-stone-700">
            <Sparkles size={13} className="text-amber-700" />
            <span className="font-metropolis text-[9px] tracking-[0.25em] uppercase font-bold text-stone-800">
              VIP Personal Shopping Concierge
            </span>
          </div>
          <h4 className="font-jost font-light text-base tracking-[0.08em] uppercase text-stone-900">
            Need Bespoke Sizing Or Same-Day Delivery?
          </h4>
          <p className="font-inter text-xs text-stone-500 leading-relaxed max-w-sm">
            Connect instantly with a dedicated Mouleeta stylist via WhatsApp for private measurements and wardrobe curation.
          </p>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto bg-[#1E293B] hover:bg-black text-white font-metropolis text-[9px] uppercase tracking-[0.2em] px-6 py-4 transition-all duration-300 flex items-center justify-center gap-2.5 font-semibold flex-shrink-0 group shadow-sm cursor-pointer"
        >
          <MessageCircle size={15} className="text-[#25D366] group-hover:scale-110 transition-transform" />
          <span>Inquire On WhatsApp</span>
        </a>

      </div>

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-stone-200/60 text-[10px] font-inter text-stone-400">
        <span className="flex items-center gap-1">
          <Clock size={12} className="text-stone-500" /> Typically replies within 5 minutes
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <ShieldCheck size={12} className="text-stone-500" /> Private client confidentiality
        </span>
      </div>
    </div>
  );
}
