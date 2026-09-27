"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';


interface UpsellProductEdge {
  node: {
    id: string;
    title: string;
    handle: string;
    featuredImage?: { url: string };
    priceRange?: { minVariantPrice?: { amount: string } };
  };
}

interface CartDrawerProps {
  upsellProducts?: UpsellProductEdge[];
}

export default function CartDrawer({ upsellProducts = [] }: CartDrawerProps) {
  const { cart, isOpen, closeCart, removeFromCart, decrementQuantity, incrementQuantity } = useCartStore();
  const router = useRouter();
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);

    try {
      const lines = cart.map(item => {
        if (item.variantId.includes('/Product/') && !item.variantId.includes('ProductVariant')) {
          throw new Error(`Corrupted Cart Item: "${item.title}". Please remove it from your bag and add it again.`);
        }
        return {
          merchandiseId: item.variantId,
          quantity: item.quantity
        };
      });

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines, email: session?.user?.email })
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Failed to initialize checkout session');
      }

      window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      const msg = error instanceof Error ? error.message : 'Something went wrong initiating checkout. Please try again.';
      alert(msg);
      setIsProcessing(false);
    }
  };

  // Calculate the total price of everything in the bag safely
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(cartTotal);

  return (
    <>
      {/* The Dark Overlay Background */}
      <div 
        role="button"
        aria-label="Close cart"
        className={`fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
        aria-hidden={!isOpen}
      />
      
      {/* The Sliding Drawer */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-[#F9F8F6] z-[110] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        
        {/* Cart Header */}
        <div className="flex justify-between items-center p-8 border-b border-stone-200 bg-white">
          <h2 id="cart-drawer-title" className="text-xs tracking-[0.2em] uppercase font-medium text-stone-900">Your Bag ({cart.length})</h2>
          <button onClick={closeCart} aria-label="Close cart" className="text-stone-400 hover:text-stone-900 transition-colors transform hover:rotate-90 duration-300 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Cart Items Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#F9F8F6]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-4 opacity-70">
              <p className="text-xs tracking-widest uppercase">Your bag is empty.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {cart.map((item, index) => {
                const itemPrice = item.price;
                const formattedItemPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(itemPrice);

                return (
                  <div key={`${item.variantId}-${index}`} className="flex gap-6 group">
                    {/* Item Image */}
                    <div className="relative w-24 aspect-[3/4] bg-stone-100 flex-shrink-0 overflow-hidden">
                      <Image 
                        src={item.image || '/placeholder.png'} 
                        alt={item.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    {/* Item Details */}
                    <div className="flex flex-col justify-between flex-1 py-1">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-[11px] tracking-[0.1em] uppercase font-medium text-stone-900 leading-relaxed pr-4">{item.title}</h3>
                          <button
                            onClick={() => removeFromCart(item.variantId)}
                            className="text-stone-300 hover:text-red-500 transition-colors text-xs cursor-pointer"
                            aria-label={`Remove ${item.title} from cart`}
                          >
                            ✕
                          </button>
                        </div>
                        <p className="text-[10px] tracking-widest text-stone-500 uppercase">Size: {item.size || 'OS'}</p>
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => decrementQuantity(item.variantId)}
                            className="w-6 h-6 flex items-center justify-center border border-stone-300 text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-colors text-sm leading-none cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="text-[11px] tracking-widest text-stone-900 min-w-[16px] text-center">{item.quantity}</span>
                          <button
                            onClick={() => incrementQuantity(item.variantId)}
                            className="w-6 h-6 flex items-center justify-center border border-stone-300 text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-colors text-sm leading-none cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] font-medium tracking-widest text-stone-900 mt-4">{formattedItemPrice}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Upsell Section */}
          {cart.length > 0 && upsellProducts && upsellProducts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-stone-200">
              <h3 className="text-[10px] tracking-widest uppercase font-medium text-stone-500 mb-6">Pairs beautifully with...</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {upsellProducts.slice(0, 3).map((edge: UpsellProductEdge) => {
                  const product = edge.node;
                  const image = product.featuredImage?.url || '/placeholder.png';
                  const price = product.priceRange?.minVariantPrice?.amount;
                  return (
                    <div 
                      key={product.id} 
                      className="flex-none w-32 group cursor-pointer" 
                      onClick={() => {
                        closeCart();
                        router.push(`/products/${product.handle}`);
                      }}
                    >
                      <div className="relative aspect-[3/4] bg-stone-100 mb-3 overflow-hidden">
                        <Image src={image} alt={product.title} fill sizes="128px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <h4 className="text-[10px] tracking-widest uppercase text-stone-900 line-clamp-1">{product.title}</h4>
                      <p className="text-[10px] font-medium tracking-widest text-stone-500 mt-1">₹{parseFloat(price || '0').toLocaleString('en-IN')}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Cart Footer / Checkout Button */}
        {cart.length > 0 && (
          <div className="p-8 border-t border-stone-200 bg-white">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[11px] tracking-widest uppercase text-stone-500">Subtotal</span>
              <span className="text-sm font-medium tracking-widest text-stone-900">{formattedTotal}</span>
            </div>
            <p className="text-[9px] tracking-widest text-stone-400 uppercase text-center mb-6">Taxes and shipping calculated at checkout</p>
            
            <motion.button 
              onClick={handleCheckout}
              disabled={isProcessing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-full bg-stone-900 text-white text-xs tracking-[0.2em] uppercase py-5 hover:bg-black hover:shadow-xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-wait flex justify-center items-center cursor-pointer"
            >
              {isProcessing ? 'Processing Securely...' : 'Checkout'}
            </motion.button>

            {/* Payment Trust Icons */}
            <div className="flex items-center justify-center gap-3 mt-4 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              {/* Apple Pay */}
              <div className="h-[22px] px-2 bg-stone-100 rounded-[3px] border border-stone-200 flex items-center justify-center">
                <svg width="28" height="13" viewBox="0 0 28 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.28 6.1C12.28 4.6 13.52 3.68 15.68 3.58C15.68 3.48 15.68 3.38 15.68 3.28C15.68 1.88 14.54 0.94 12.82 0.94C11.5 0.94 10.26 1.78 9.6 1.78C8.84 1.78 7.98 1.02 7.04 1.02C5.8 1.02 4.56 1.78 4.02 2.82C2.68 5.18 3.54 8.66 4.86 10.44C5.52 11.28 6.18 12.32 7.12 12.32C8.06 12.32 8.44 11.66 9.58 11.66C10.7 11.66 10.98 12.32 12.02 12.32C12.96 12.32 13.62 11.38 14.18 10.44C14.94 9.4 15.22 8.36 15.22 8.26C15.12 8.16 12.28 7.12 12.28 6.1ZM10.48 0C11.04 -0.66 11.42 -1.6 11.24 -2.54C10.48 -2.44 9.44 -1.98 8.88 -1.32C8.42 -0.76 8.04 0.18 8.22 1.08C9.08 1.18 9.92 0.72 10.48 0Z" fill="#1A1A1A"/>
                  <path d="M18.82 12.14V0.94H20.76V6.92H25.04V0.94H26.98V12.14H25.04V8.5H20.76V12.14H18.82Z" fill="#1A1A1A"/>
                </svg>
              </div>
              {/* Google Pay */}
              <div className="h-[22px] px-2 bg-stone-100 rounded-[3px] border border-stone-200 flex items-center justify-center">
                <svg width="28" height="13" viewBox="0 0 40 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.6 1.72C14.6 1.2 14.55 0.69 14.47 0.2H7.44V3.12H11.46C11.28 4.09 10.74 4.9 9.93 5.43V7.3H12.34C13.75 6.01 14.6 4.05 14.6 1.72Z" fill="#4285F4"/>
                  <path d="M7.44 9.02C9.45 9.02 11.14 8.35 12.34 7.3L9.93 5.43C9.28 5.86 8.43 6.12 7.44 6.12C5.52 6.12 3.88 4.82 3.29 3.08H0.8V5.01C2.02 7.44 4.54 9.02 7.44 9.02Z" fill="#34A853"/>
                  <path d="M3.29 3.08C3.14 2.65 3.06 2.19 3.06 1.72C3.06 1.25 3.14 0.79 3.29 0.36V-1.57H0.8C0.29 -0.56 0 0.55 0 1.72C0 2.89 0.29 4 0.8 5.01L3.29 3.08Z" fill="#FBBC04"/>
                  <path d="M7.44 -2.68C8.53 -2.68 9.51 -2.31 10.28 -1.57L12.43 -3.72C11.14 -4.92 9.45 -5.58 7.44 -5.58C4.54 -5.58 2.02 -4 0.8 -1.57L3.29 0.36C3.88 -1.38 5.52 -2.68 7.44 -2.68Z" fill="#EA4335"/>
                  <path d="M21.2 1.72H18V12H21.2C22.6 12 23.8 11.6 24.8 10.8C25.8 10 26.3 8.9 26.3 7.5C26.3 6.1 25.8 5 24.8 4.2C23.8 3.4 22.6 3 21.2 3V1.72ZM21 9.9H20.2V4.8H21C21.8 4.8 22.4 5 22.9 5.5C23.4 6 23.6 6.7 23.6 7.5C23.6 8.3 23.4 9 22.9 9.5C22.4 9.8 21.8 9.9 21 9.9Z" fill="#5F6368" transform="translate(0, 1.5)"/>
                  <path d="M31.2 12C31.5 12 31.8 11.9 32 11.8V9.8C31.8 9.9 31.5 10 31.3 10C30.9 10 30.6 9.9 30.4 9.7C30.2 9.5 30.1 9.2 30.1 8.8V5.3H32.2V3.3H30.1V0.9H28.1V3.3H26.5V5.3H28.1V9C28.1 10 28.4 10.7 28.9 11.2C29.4 11.7 30.2 12 31.2 12Z" fill="#5F6368" transform="translate(0, 1.5)"/>
                  <path d="M36.1 3.3L34.2 8.7L32.3 3.3H30.2L33.3 11.6L31.3 16H33.5L38.4 3.3H36.1Z" fill="#5F6368" transform="translate(0, 1.5)"/>
                </svg>
              </div>
              {/* Visa Placeholder */}
              <div className="h-[22px] px-2 bg-stone-100 rounded-[3px] border border-stone-200 flex items-center justify-center">
                <svg width="28" height="13" viewBox="0 0 34 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.9 0.2H8.8L6.4 7.9L5.3 1.9C5.1 1 4.4 0.3 3.5 0.2H0L0.1 0.7C1.8 1 2.8 1.5 3.3 2.5L5.6 10.8H9.9L12.9 0.2ZM24.6 7.4C24.6 4.5 20.6 4.4 20.6 3.1C20.6 2.7 21 2.3 21.8 2.2C22.2 2.1 23.2 2 24.7 2.7L25.3 0.4C24.5 0.1 23.4 0 22.2 0C18.2 0 15.5 2.1 15.5 5.1C15.5 7.3 17.5 8.6 19.1 9.3C20.7 10.1 21.2 10.6 21.2 11.3C21.2 12.3 20 12.8 18.9 12.8C17.2 12.8 16.2 12.3 15.4 11.9L14.8 14.3C15.6 14.7 17.1 15.1 18.7 15.1C23 15.1 24.6 13 24.6 10.1C24.6 9.4 24.6 8.4 24.6 7.4ZM32.3 10.8H35.8L33.4 0.2H30C29.3 0.2 28.7 0.6 28.5 1.3L24.3 10.8H28.6L29.4 8.5H34.6L35.1 10.8H32.3ZM30.6 5.4L32.1 1.4L32.9 5.4H30.6ZM15 10.8H11L13.4 0.2H17.4L15 10.8Z" fill="#1434CB"/>
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
