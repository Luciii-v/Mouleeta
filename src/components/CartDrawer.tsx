"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import { createCart, addToCart } from '@/lib/shopify';

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
  const { cart, isOpen, closeCart, removeFromCart } = useCartStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);

    try {
      // 1. Create a fresh Shopify cart session
      const newCart = await createCart();
      if (!newCart) throw new Error("Failed to create checkout session");

      // 2. Map local cart items to Shopify line items
      const lines = cart.map(item => {
        if (item.variantId.includes('/Product/') && !item.variantId.includes('ProductVariant')) {
          throw new Error(`Corrupted Cart Item: "${item.title}". Please remove it from your bag and add it again.`);
        }
        return {
          merchandiseId: item.variantId,
          quantity: item.quantity
        };
      });

      // 3. Add items to the Shopify cart
      const cartWithItems = await addToCart(newCart.id, lines);
      if (!cartWithItems) throw new Error("Failed to add items to checkout");

      // 4. Redirect to the official Shopify Checkout page securely
      // Shopify may return the primary custom domain (e.g. mouleeta.com) for checkout URLs, 
      // but since that domain points to a LiteSpeed server currently, we must force the 
      // .myshopify.com domain to prevent a 404 error.
      const checkoutUrlObj = new URL(newCart.checkoutUrl);
      const checkoutDomain = process.env.NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'kvd0hr-0x.myshopify.com';
      checkoutUrlObj.hostname = checkoutDomain;
      
      // Shopify aggressively redirects .myshopify.com URLs back to the primary custom domain.
      // We append ?_fd=0 to bypass this when using a .myshopify.com domain.
      if (checkoutDomain.includes('myshopify.com')) {
        checkoutUrlObj.searchParams.set('_fd', '0');
      }
      
      window.location.href = checkoutUrlObj.toString();

    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong initiating checkout. Please try again.');
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
                          <button onClick={() => removeFromCart(item.variantId)} className="text-stone-300 hover:text-red-500 transition-colors text-xs cursor-pointer">
                            ✕
                          </button>
                        </div>
                        <p className="text-[10px] tracking-widest text-stone-500 uppercase">Size: {item.size || 'OS'}</p>
                        <p className="text-[10px] tracking-widest text-stone-500 uppercase mt-1">Qty: {item.quantity}</p>
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
            
            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-stone-900 text-white text-xs tracking-[0.2em] uppercase py-5 hover:bg-black hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-wait flex justify-center items-center cursor-pointer"
            >
              {isProcessing ? 'Processing Securely...' : 'Checkout'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
