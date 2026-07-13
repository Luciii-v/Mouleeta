"use client";

import React, { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticButton from '@/components/MagneticButton';

interface VariantNode {
  id: string;
  title: string;
  availableForSale: boolean;
  price?: {
    amount: string;
    currencyCode: string;
  };
  priceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

interface ProductFormProps {
  product: {
    id: string;
    title: string;
    descriptionHtml: string;
    images?: {
      edges: {
        node: {
          url: string;
        }
      }[]
    };
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    variants: {
      edges: {
        node: VariantNode;
      }[];
    };
  };
}

export default function ProductForm({ product }: ProductFormProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Set the first available variant as the default selection
  const [selectedVariant, setSelectedVariant] = useState<VariantNode>(
    product.variants.edges.find(({ node }) => node.availableForSale)?.node || product.variants.edges[0]?.node
  );

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    const price = selectedVariant?.price?.amount 
      || selectedVariant?.priceRange?.minVariantPrice?.amount 
      || product.priceRange.minVariantPrice.amount;

    addToCart({
      id: product.id,
      variantId: selectedVariant.id,
      title: product.title,
      price: parseFloat(price),
      image: product.images?.edges?.[0]?.node?.url || '/placeholder.png',
      size: selectedVariant.title,
    });
  };

  // Dynamically format price based on the selected variant or product base price
  const variantPrice = selectedVariant?.price?.amount 
    || selectedVariant?.priceRange?.minVariantPrice?.amount 
    || product.priceRange.minVariantPrice.amount;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(parseFloat(variantPrice));

  return (
    <div className="sticky top-32 pb-24">
      <h1 className="text-3xl font-light tracking-[0.15em] uppercase text-stone-900 mb-4">
        {product.title}
      </h1>
      <p className="text-sm font-medium tracking-widest text-stone-500 mb-10">
        {formattedPrice}
      </p>

      {/* Optimized Variant Selector */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[11px] uppercase tracking-[0.2em] text-stone-900">Select Option</span>
          <button 
            onClick={() => setShowSizeGuide(true)}
            className="text-[10px] uppercase tracking-widest text-stone-500 underline underline-offset-4 hover:text-stone-900 transition-colors"
          >
            Size Guide
          </button>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {product.variants.edges.map(({ node: variant }) => {
            const isSelected = selectedVariant?.id === variant.id;
            
            return (
              <button 
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                disabled={!variant.availableForSale}
                className={`py-3 px-6 text-[11px] tracking-widest uppercase border transition-all duration-300 ${
                  !variant.availableForSale 
                    ? 'border-stone-200 text-stone-300 cursor-not-allowed line-through' 
                    : isSelected
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-300 text-stone-900 hover:border-stone-900'
                }`}
              >
                {variant.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add to Bag Button */}
      <MagneticButton strength={15} className="w-full mb-12">
        <button 
          onClick={handleAddToCart}
          disabled={!selectedVariant?.availableForSale}
          className="w-full bg-stone-900 text-white text-xs tracking-[0.2em] uppercase py-5 hover:bg-black hover:shadow-2xl transition-all duration-300 flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:bg-stone-800 active:scale-[0.98] transition-all duration-400 ease-out"
        >
          {selectedVariant?.availableForSale ? 'Add to Bag' : 'Out of Stock'}
        </button>
      </MagneticButton>

      {/* Product Description */}
      <div 
        className="prose prose-sm prose-stone text-[13px] font-light leading-relaxed tracking-wide"
        dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
      />

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
              onClick={() => setShowSizeGuide(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative bg-[#F9F8F6] p-8 max-w-md w-full shadow-2xl flex flex-col gap-4 z-[201]"
            >
              <div className="flex justify-between items-center border-b border-onyx/10 pb-4">
                <h2 className="font-jost text-xl tracking-[0.1em] uppercase">Size Guide</h2>
                <button onClick={() => setShowSizeGuide(false)} className="text-2xl font-light hover:text-black/60 transition-colors cursor-pointer">&times;</button>
              </div>
              <div className="py-4">
                <table className="w-full text-left font-inter text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-onyx/10 text-stone-500 text-xs tracking-widest uppercase">
                      <th className="py-3 font-medium">Size</th>
                      <th className="py-3 font-medium">Chest</th>
                      <th className="py-3 font-medium">Waist</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-onyx/5">
                      <td className="py-3">S</td><td className="py-3">36&quot;</td><td className="py-3">28&quot;</td>
                    </tr>
                    <tr className="border-b border-onyx/5">
                      <td className="py-3">M</td><td className="py-3">38&quot;</td><td className="py-3">30&quot;</td>
                    </tr>
                    <tr className="border-b border-onyx/5">
                      <td className="py-3">L</td><td className="py-3">40&quot;</td><td className="py-3">32&quot;</td>
                    </tr>
                    <tr>
                      <td className="py-3">XL</td><td className="py-3">42&quot;</td><td className="py-3">34&quot;</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
