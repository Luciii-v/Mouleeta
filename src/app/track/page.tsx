"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Truck, CheckCircle2, RotateCcw, Sparkles, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

interface TrackingStatus {
  orderNumber: string;
  date: string;
  status: 'processing' | 'in_transit' | 'delivered';
  carrier: string;
  trackingCode: string;
  estimatedDelivery: string;
  items: {
    title: string;
    size: string;
    price: number;
    image: string;
  }[];
  address: string;
}

const mockOrders: Record<string, TrackingStatus> = {
  "MOU-8942": {
    orderNumber: "MOU-8942",
    date: "July 4, 2026",
    status: "in_transit",
    carrier: "Bluedart Luxury Express",
    trackingCode: "BD-9942018475-IN",
    estimatedDelivery: "Tomorrow, July 7 by 6:00 PM",
    items: [
      {
        title: "The Velvet Noir Evening Gown",
        size: "Size M",
        price: 34500,
        image: "/velvet-dress.png"
      }
    ],
    address: "A-14, Amrita Shergill Marg, New Delhi, 110003"
  },
  "MOU-7105": {
    orderNumber: "MOU-7105",
    date: "June 28, 2026",
    status: "delivered",
    carrier: "DHL Priority Atelier",
    trackingCode: "DHL-48829104-IN",
    estimatedDelivery: "Delivered on July 1, 2026 at 3:15 PM",
    items: [
      {
        title: "Hand-Pleated Silk Georgette Dress",
        size: "Size S",
        price: 42000,
        image: "/georgette-dress.png"
      },
      {
        title: "Raw Silk Evening Coat",
        size: "Size S",
        price: 28500,
        image: "/trousers.png"
      }
    ],
    address: "Palmera Penthouse, Worli Sea Face, Mumbai, 400030"
  }
};

export default function TrackOrderPage() {
  const [orderInput, setOrderInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [activeOrder, setActiveOrder] = useState<TrackingStatus | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Return / Exchange portal states
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState("size_exchange");
  const [selectedSize, setSelectedSize] = useState("S");
  const [returnSubmitted, setReturnSubmitted] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = orderInput.trim().toUpperCase();
    if (mockOrders[clean]) {
      setActiveOrder(mockOrders[clean]);
      setNotFound(false);
    } else {
      setActiveOrder(null);
      setNotFound(true);
    }
  };

  const loadDemoOrder = (id: string) => {
    setOrderInput(id);
    setEmailInput("client@luxury.com");
    setActiveOrder(mockOrders[id]);
    setNotFound(false);
    setReturnSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] flex flex-col font-inter selection:bg-stone-900 selection:text-white">
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-16 md:py-24">
        
        {/* Editorial Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-stone-100 px-4 py-1.5 rounded-full text-amber-800 text-[10px] font-metropolis uppercase tracking-[0.25em] font-semibold border border-stone-200">
            <Sparkles size={13} />
            <span>Mouleeta Privé Service</span>
          </div>
          <h1 className="font-jost font-light text-3xl md:text-5xl tracking-[0.15em] uppercase text-stone-900">
            Order Tracking &amp; Returns
          </h1>
          <p className="font-inter text-sm text-stone-500 leading-relaxed">
            Monitor your handcrafted piece from our atelier to your residence, or initiate a complimentary white-glove exchange.
          </p>
        </div>

        {/* Search Bar & Demo Pills */}
        <div className="bg-white p-6 sm:p-8 border border-stone-200/80 shadow-md mb-12">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5">
              <label className="block font-metropolis text-[9px] tracking-[0.2em] uppercase text-stone-400 mb-2 font-bold">
                Order Number
              </label>
              <input
                type="text"
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                placeholder="e.g. MOU-8942"
                className="w-full bg-[#FAF9F6] border border-stone-300 p-4 font-jost text-sm uppercase tracking-wider focus:outline-none focus:border-black transition-colors"
                required
              />
            </div>

            <div className="md:col-span-4">
              <label className="block font-metropolis text-[9px] tracking-[0.2em] uppercase text-stone-400 mb-2 font-bold">
                Email or Phone Number
              </label>
              <input
                type="text"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="e.g. client@domain.com"
                className="w-full bg-[#FAF9F6] border border-stone-300 p-4 font-inter text-sm focus:outline-none focus:border-black transition-colors"
                required
              />
            </div>

            <div className="md:col-span-3 flex items-end">
              <button
                type="submit"
                className="w-full bg-stone-900 text-white font-metropolis text-[10px] tracking-[0.25em] uppercase p-4 hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer font-semibold shadow-sm"
              >
                <Search size={14} /> Track Order
              </button>
            </div>
          </form>

          {/* Demo Order Pills */}
          <div className="mt-6 pt-6 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400">
            <span className="font-metropolis text-[9px] uppercase tracking-widest font-semibold text-stone-500">
              Try Demo Orders:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => loadDemoOrder("MOU-8942")}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-metropolis text-[9px] uppercase tracking-widest transition-colors cursor-pointer font-medium flex items-center gap-1.5"
              >
                <Truck size={12} className="text-amber-700" /> [MOU-8942] In Transit
              </button>
              <button
                onClick={() => loadDemoOrder("MOU-7105")}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-metropolis text-[9px] uppercase tracking-widest transition-colors cursor-pointer font-medium flex items-center gap-1.5"
              >
                <CheckCircle2 size={12} className="text-emerald-700" /> [MOU-7105] Delivered &amp; Exchangeable
              </button>
            </div>
          </div>
        </div>

        {/* Tracking Results Area */}
        <AnimatePresence mode="wait">
          {notFound && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-stone-200 p-8 shadow-sm text-center max-w-xl mx-auto space-y-6"
            >
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-600">
                <Truck size={20} strokeWidth={1.5} />
              </div>
              <h3 className="font-jost text-lg uppercase tracking-widest text-stone-900">Active Tracking Information</h3>
              <p className="font-inter text-xs text-stone-500 leading-relaxed max-w-md mx-auto">
                For security and real-time updates, active order tracking is processed directly by our logistics partners. Please refer to the shipment confirmation email or SMS sent to your registered contact details.
              </p>
              <div className="pt-4 border-t border-stone-100 text-xs font-inter text-stone-400">
                If you did not receive your tracking link or require concierge support, please contact us at <a href="mailto:shopmouleeta@gmail.com" className="underline hover:text-stone-900 transition-colors">shopmouleeta@gmail.com</a> or call <a href="tel:+919911888029" className="underline hover:text-stone-900 transition-colors">+91 9911888029</a>.
              </div>
            </motion.div>
          )}

          {activeOrder && (
            <motion.div
              key={activeOrder.orderNumber}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-10"
            >
              
              {/* Status Header Banner */}
              <div className="bg-white border border-stone-200 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-jost text-2xl font-light tracking-widest uppercase text-stone-900">
                      Order {activeOrder.orderNumber}
                    </span>
                    <span className={`px-3 py-1 rounded-full font-metropolis text-[9px] uppercase tracking-widest font-bold ${
                      activeOrder.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {activeOrder.status === 'delivered' ? '• Delivered' : '• In Transit To Residence'}
                    </span>
                  </div>
                  <p className="font-inter text-xs text-stone-400">
                    Placed on {activeOrder.date} • Carrier: <strong className="text-stone-700">{activeOrder.carrier}</strong> ({activeOrder.trackingCode})
                  </p>
                </div>

                <div className="bg-stone-50 border border-stone-200 px-5 py-4 text-left md:text-right w-full md:w-auto">
                  <span className="font-metropolis text-[9px] uppercase tracking-widest text-stone-400 block mb-1 font-bold">
                    {activeOrder.status === 'delivered' ? 'Delivery Date' : 'Estimated Arrival'}
                  </span>
                  <span className="font-jost text-base md:text-lg font-medium text-stone-900 tracking-wider">
                    {activeOrder.estimatedDelivery}
                  </span>
                </div>
              </div>

              {/* Visual Timeline Steps */}
              <div className="bg-white border border-stone-200 p-8 shadow-sm">
                <h3 className="font-metropolis text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-8 font-bold">
                  Atelier Dispatch &amp; Transit Milestone
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                  
                  {/* Step 1: Placed */}
                  <div className="flex md:flex-col items-start md:items-center text-left md:text-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-md">
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-jost text-sm font-semibold uppercase tracking-wider text-stone-900 mb-1">
                        1. Atelier Order Placed
                      </h4>
                      <p className="font-inter text-xs text-stone-400">
                        Specifications confirmed &amp; assigned to master tailor.
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Quality Inspection */}
                  <div className="flex md:flex-col items-start md:items-center text-left md:text-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-md">
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-jost text-sm font-semibold uppercase tracking-wider text-stone-900 mb-1">
                        2. Bespoke Craftsmanship
                      </h4>
                      <p className="font-inter text-xs text-stone-400">
                        Hand-stitching completed &amp; passed 12-point quality check.
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Courier Dispatched */}
                  <div className="flex md:flex-col items-start md:items-center text-left md:text-center gap-4 relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 shadow-md ${
                      activeOrder.status === 'in_transit' || activeOrder.status === 'delivered'
                        ? 'bg-amber-600 text-white animate-pulse'
                        : 'bg-stone-200 text-stone-400'
                    }`}>
                      <Truck size={18} />
                    </div>
                    <div>
                      <h4 className="font-jost text-sm font-semibold uppercase tracking-wider text-stone-900 mb-1">
                        3. White-Glove Transit
                      </h4>
                      <p className="font-inter text-xs text-stone-400">
                        Dispatched via temperature-controlled luxury express.
                      </p>
                    </div>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="flex md:flex-col items-start md:items-center text-left md:text-center gap-4 relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 shadow-md ${
                      activeOrder.status === 'delivered'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-stone-200 text-stone-400'
                    }`}>
                      <Package size={18} />
                    </div>
                    <div>
                      <h4 className="font-jost text-sm font-semibold uppercase tracking-wider text-stone-900 mb-1">
                        4. Residence Delivery
                      </h4>
                      <p className="font-inter text-xs text-stone-400">
                        {activeOrder.status === 'delivered' ? 'Hand-delivered with garment bag.' : 'Pending doorstep arrival.'}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Grid: Items Summary & Exchange Box */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Left: Ordered Items */}
                <div className="md:col-span-7 bg-white border border-stone-200 p-6 md:p-8 shadow-sm space-y-6">
                  <h3 className="font-metropolis text-[10px] tracking-[0.2em] uppercase text-stone-400 font-bold">
                    Garments In Shipment
                  </h3>

                  <div className="divide-y divide-stone-100">
                    {activeOrder.items.map((item, idx) => (
                      <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                        <div className="relative w-16 h-20 bg-[#F5EFE7] flex-shrink-0 overflow-hidden border border-stone-200">
                          <Image src={item.image} alt={item.title} fill sizes="64px" className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-jost font-light text-base tracking-wide text-stone-900 uppercase truncate">
                            {item.title}
                          </h4>
                          <span className="font-inter text-xs text-stone-500 block">
                            {item.size} • Handcrafted in Silk/Georgette
                          </span>
                        </div>
                        <div className="font-inter text-sm font-semibold text-stone-900">
                          ₹{item.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-stone-100 text-xs font-inter text-stone-500 flex items-center justify-between">
                    <span>Shipping Destination:</span>
                    <span className="font-medium text-stone-800 text-right max-w-xs">{activeOrder.address}</span>
                  </div>
                </div>

                {/* Right: White-Glove Exchange Box */}
                <div className="md:col-span-5 bg-stone-900 text-white p-6 md:p-8 flex flex-col justify-between shadow-lg relative overflow-hidden">
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-2 text-amber-400 text-[10px] font-metropolis uppercase tracking-widest font-semibold">
                      <RotateCcw size={14} />
                      <span>White-Glove Doorstep Exchange</span>
                    </div>

                    <h3 className="font-jost font-light text-2xl tracking-widest uppercase">
                      Need Size Alteration Or Return?
                    </h3>

                    <p className="font-inter text-xs text-stone-300 leading-relaxed">
                      If the drape is not absolute perfection, our private courier will pick up the garment from your residence within 24 hours. Complimentary tailoring included.
                    </p>

                    {returnSubmitted ? (
                      <div className="p-4 bg-emerald-900/60 border border-emerald-500/50 rounded-none text-emerald-200 text-xs space-y-2">
                        <div className="flex items-center gap-2 font-bold text-emerald-400 font-metropolis uppercase tracking-wider text-[11px]">
                          <CheckCircle2 size={16} /> Pickup Scheduled
                        </div>
                        <p>
                          A dedicated concierge courier has been dispatched for tomorrow between <strong>10:00 AM - 1:00 PM</strong> at your registered residence.
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowReturnModal(true)}
                        className="w-full bg-white text-stone-900 hover:bg-stone-200 font-metropolis text-[10px] tracking-[0.2em] uppercase py-4 font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 mt-4 shadow-md"
                      >
                        Initiate Instant Exchange <ArrowRight size={14} />
                      </button>
                    )}
                  </div>

                  <div className="pt-6 border-t border-stone-800 flex items-center justify-between text-[10px] text-stone-400 font-inter mt-6 relative z-10">
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-stone-500" /> 14-Day Guarantee
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={13} className="text-stone-500" /> Zero Return Fees
                    </span>
                  </div>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Exchange Modal */}
        <AnimatePresence>
          {showReturnModal && activeOrder && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowReturnModal(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative z-10 bg-[#FAF9F6] p-8 max-w-lg w-full shadow-2xl border border-stone-300 space-y-6"
              >
                <div className="flex justify-between items-start border-b border-stone-200 pb-4">
                  <div>
                    <span className="font-metropolis text-[9px] uppercase tracking-widest text-amber-800 font-bold block mb-1">
                      Order {activeOrder.orderNumber}
                    </span>
                    <h3 className="font-jost text-xl tracking-widest uppercase text-stone-900">
                      Request Doorstep Exchange
                    </h3>
                  </div>
                  <button onClick={() => setShowReturnModal(false)} className="text-2xl text-stone-400 hover:text-black cursor-pointer w-8 h-8 flex items-center justify-center">&times;</button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-metropolis text-[9px] uppercase tracking-widest text-stone-500 font-bold mb-2">
                      Reason for Exchange / Return
                    </label>
                    <select
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      className="w-full p-3.5 bg-white border border-stone-300 font-inter text-xs text-stone-800 focus:outline-none focus:border-black"
                    >
                      <option value="size_exchange">Size Exchange - Need A Different Fit</option>
                      <option value="alteration">Custom Alteration Requested</option>
                      <option value="credit">Return For Boutique Credit / Refund</option>
                    </select>
                  </div>

                  {returnReason === "size_exchange" && (
                    <div>
                      <label className="block font-metropolis text-[9px] uppercase tracking-widest text-stone-500 font-bold mb-2">
                        Select Replacement Size
                      </label>
                      <div className="flex gap-2">
                        {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSelectedSize(s)}
                            className={`flex-1 py-3 font-jost text-sm uppercase font-bold border transition-colors cursor-pointer ${
                              selectedSize === s ? 'bg-stone-900 text-white border-black' : 'bg-white text-stone-700 border-stone-300 hover:border-black'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-stone-100 border border-stone-200 text-xs font-inter text-stone-600 space-y-1">
                    <p className="font-semibold text-stone-900">White-Glove Pickup Terms:</p>
                    <p>• Our private courier will collect the item from your registered address tomorrow.</p>
                    <p>• Ensure original luxury garment bag and atelier tags remain intact.</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowReturnModal(false)}
                    className="flex-1 py-3.5 border border-stone-300 text-stone-700 font-metropolis text-[9px] uppercase tracking-widest hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setReturnSubmitted(true);
                      setShowReturnModal(false);
                    }}
                    className="flex-1 py-3.5 bg-stone-900 text-white font-metropolis text-[9px] uppercase tracking-widest hover:bg-black transition-colors cursor-pointer font-bold shadow-sm"
                  >
                    Confirm Doorstep Pickup
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
