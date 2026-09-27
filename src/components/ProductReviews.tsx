'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';

interface ProductReviewsProps {
  productId?: string;
  productHandle?: string;
}

export default function ProductReviews({ productId, productHandle }: ProductReviewsProps) {
  const numericId = productId ? productId.split('/').pop() : '';
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // Re-initialize Judge.me widget when component mounts or product changes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).jdgm && (window as any).jdgm.initializeWidget) {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).jdgm.initializeWidget();
      }, 500);
    }
    
    // Fallback: If Judge.me doesn't replace the content within 5 seconds, hide our spinner
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [productId]);

  if (!productId) return null;

  return (
    <section className="py-24 border-t border-onyx/10 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Judge.me Settings & Preloader */}
        <Script id="judgeme-settings" strategy="afterInteractive">
          {`
            (window as any).jdgm = (window as any).jdgm || {};
            (window as any).jdgm.SHOP_DOMAIN = 'kvd0hr-0x.myshopify.com'; 
          `}
        </Script>
        <Script src="https://cdn1.judge.me/widget_preloader.js" strategy="afterInteractive" />

        {/* Judge.me Widget Container */}
        <div className="min-h-[300px]">
          <div 
            className="jdgm-widget jdgm-review-widget" 
            data-id={numericId} 
            data-handle={productHandle}
          >
            {/* Fallback loader while Judge.me connects */}
            {loading ? (
              <div className="flex flex-col items-center justify-center h-48 opacity-50">
                <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin mb-4"></div>
                <p className="font-jost text-xs tracking-widest uppercase text-stone-500">Connecting Judge.me Reviews...</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
