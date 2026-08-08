"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";

export interface OrderItem {
  name: string;
  price: string;
  qty: number;
  image: string;
  options?: { name: string; value: string }[];
  variant?: string;
}

export interface OrderBreakdownModalProps {
  orderNumber: string;
  status: string;
  totalPaid: string;
  items: OrderItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderBreakdownModal({
  orderNumber,
  status,
  totalPaid,
  items,
  isOpen,
  onClose,
}: OrderBreakdownModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-[460px] bg-white border border-gray-200 shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-8 pt-11 pb-9 relative text-gray-900 max-h-[90vh] overflow-y-auto no-scrollbar">
              {/* Close */}
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-5 right-6 flex h-7 w-7 items-center justify-center rounded-full border border-transparent text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
              >
                <X size={16} strokeWidth={1.5} />
              </button>

              {/* Logo */}
              <div className="relative mx-auto mb-6 flex h-10 w-16 items-center justify-center">
                <Image src="/logo.svg" alt="Logo" fill className="object-contain" />
              </div>

              <p className="text-center font-inter text-[10.5px] uppercase tracking-[0.28em] text-gray-500 mb-2">
                Order Breakdown
              </p>
              <h1 className="text-center font-inter font-medium text-[28px] text-gray-900 mb-6">
                ORDER #{orderNumber}
              </h1>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />

              {/* Meta row */}
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="font-inter text-[10px] uppercase tracking-[0.22em] text-gray-500 mb-2">
                    Status
                  </p>
                  <div className="flex items-center gap-2 font-inter font-medium text-[16px] text-gray-900">
                    <span className="h-1.5 w-1.5 rounded-full bg-black shadow-[0_0_0_3px_rgba(0,0,0,0.1)]" />
                    {status}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-inter text-[10px] uppercase tracking-[0.22em] text-gray-500 mb-2">
                    Total Paid
                  </p>
                  <div className="font-inter font-medium text-lg text-gray-900 tabular-nums">
                    {totalPaid}
                  </div>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />

              <p className="font-inter text-[10px] uppercase tracking-[0.22em] text-gray-500 mb-4">
                Purchased Items
              </p>

              <div className="space-y-6">
                {items.map((item, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="relative h-[160px] w-[120px] flex-shrink-0 overflow-hidden border border-gray-100 bg-gray-50">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[8px] uppercase tracking-widest text-gray-400">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex h-[160px] flex-1 flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between gap-3 items-start">
                          <h2 className="font-inter font-medium text-[15px] leading-tight text-gray-900">
                            {item.name}
                          </h2>
                          <div className="whitespace-nowrap pt-1 font-inter text-xs font-medium tabular-nums text-gray-900">
                            {item.price}
                          </div>
                        </div>
                        
                        <div className="mt-2 space-y-1">
                          {item.options && item.options.length > 0 ? (
                            item.options.map((opt, oIdx) => (
                              <p key={oIdx} className="font-inter text-[10px] uppercase tracking-wider text-gray-500">
                                <span className="text-gray-400 mr-2">{opt.name}:</span> <span className="text-gray-800">{opt.value}</span>
                              </p>
                            ))
                          ) : item.variant !== "Default Title" ? (
                            <p className="font-inter text-[10px] uppercase tracking-wider text-gray-500">
                              <span className="text-gray-400 mr-2">Variant:</span> <span className="text-gray-800">{item.variant}</span>
                            </p>
                          ) : null}
                        </div>
                      </div>
                      
                      <p className="font-inter text-[10px] uppercase tracking-[0.16em] text-gray-500">
                        Qty — {String(item.qty).padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={onClose}
                className="mt-10 w-full border border-gray-900 bg-white py-[14px] font-inter font-medium text-[11px] uppercase tracking-[0.24em] text-gray-900 transition-colors duration-300 hover:bg-gray-900 hover:text-white cursor-pointer"
              >
                Close Window
              </button>


            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
