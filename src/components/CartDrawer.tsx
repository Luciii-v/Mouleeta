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
            <div className="flex items-center justify-center gap-3 mt-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              {/* Apple Pay */}
              <svg width="34" height="22" viewBox="0 0 34 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="34" height="22" rx="3" fill="#1A1A1A"/>
                <path d="M14.6 13.9C14.6 12.3 15.9 11.4 18.2 11.3C18.2 11.2 18.2 11.1 18.2 11C18.2 9.5 17 8.5 15.2 8.5C13.8 8.5 12.5 9.4 11.8 9.4C11 9.4 10.1 8.6 9.1 8.6C7.8 8.6 6.5 9.4 5.9 10.5C4.5 13 5.4 16.7 6.8 18.6C7.5 19.5 8.2 20.6 9.2 20.6C10.2 20.6 10.6 19.9 11.8 19.9C13 19.9 13.3 20.6 14.4 20.6C15.4 20.6 16.1 19.6 16.7 18.6C17.5 17.5 17.8 16.4 17.8 16.3C17.7 16.2 14.6 15.1 14.6 13.9ZM12.7 7.2C13.3 6.5 13.7 5.5 13.5 4.5C12.7 4.6 11.6 5.1 11 5.8C10.5 6.4 10.1 7.4 10.3 8.3C11.2 8.4 12.1 7.9 12.7 7.2Z" fill="white"/>
              </svg>
              {/* Google Pay */}
              <svg width="34" height="22" viewBox="0 0 34 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="34" height="22" rx="3" fill="white" stroke="#E5E5E5"/>
                <path d="M13.6 11.3L12.3 14.7H11.2L12.9 10.4L11.1 5.6H12.3L13.5 9.2C13.6 9.5 13.7 9.8 13.7 10C13.8 9.8 13.9 9.5 14 9.2L15.3 5.6H16.4L13.6 11.3Z" fill="#5F6368"/>
                <path d="M19.3 12.5C18.6 12.5 18 12.3 17.6 11.9C17.1 11.5 16.9 11 16.9 10.4C16.9 9.7 17.1 9.2 17.6 8.9C18.1 8.5 18.8 8.3 19.5 8.3C20.2 8.3 20.7 8.4 21.1 8.6V8.4C21.1 7.9 20.9 7.4 20.5 7.1C20.2 6.8 19.8 6.7 19.3 6.7C18.9 6.7 18.6 6.8 18.3 6.9C18 7.1 17.8 7.3 17.7 7.6L16.8 6.9C17 6.4 17.4 6.1 17.9 5.8C18.4 5.6 18.9 5.5 19.5 5.5C20.4 5.5 21.1 5.8 21.6 6.3C22 6.8 22.3 7.5 22.3 8.3V12.3H21.2V11.5H21.2C20.7 12.2 20.1 12.5 19.3 12.5ZM19.5 11.6C20 11.6 20.4 11.4 20.7 11.1C21 10.8 21.2 10.4 21.2 10C20.9 9.7 20.4 9.6 19.7 9.6C19.2 9.6 18.8 9.7 18.5 9.9C18.2 10.1 18 10.4 18 10.7C18 11.3 18.5 11.6 19.5 11.6Z" fill="#5F6368"/>
              </svg>
              {/* Visa Placeholder */}
              <div className="w-[34px] h-[22px] bg-stone-100 rounded-[3px] border border-stone-200 flex items-center justify-center">
                <span className="font-jost text-[8px] font-bold text-blue-800">VISA</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
}
