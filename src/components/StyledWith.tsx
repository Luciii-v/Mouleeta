"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import WishlistButton from '@/components/WishlistButton';
import { mockProducts } from '@/lib/dummyData';

interface StyledWithProps {
  currentProductId?: string;
  currentCategory?: string;
  allProducts?: any[];
}

const recommendations = [
  ...mockProducts,
  {
    id: "raw-silk-evening-coat",
    title: "Raw Silk Evening Coat",
    slug: "raw-silk-evening-coat",
    price: 28500,
    description: "An unlined open-front evening coat tailored from heavyweight raw silk with deep patch pockets.",
    images: ["/trousers.png"],
    categoryId: "women",
    subCategoryId: "outerwear",
    inStock: true
  },
  {
    id: "pleated-georgette-scarf",
    title: "Pleated Georgette Evening Scarf",
    slug: "pleated-georgette-scarf",
    price: 8900,
    description: "Hand-pleated silk georgette scarf designed to drape effortlessly over tailored silhouettes.",
    images: ["/georgette-dress.png"],
    categoryId: "women",
    subCategoryId: "accessories",
    inStock: true
  }
];

export default function StyledWith({ currentProductId, allProducts }: StyledWithProps) {
  const { addToCart } = useCartStore();

  let finalRecommendations = recommendations;
  if (allProducts && allProducts.length > 0) {
    finalRecommendations = allProducts.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.handle,
      price: Math.round(parseFloat(p.priceRange?.minVariantPrice?.amount || '0')),
      description: p.description || '',
      images: p.images?.edges?.map((e: any) => e.node.url) || ['/placeholder.png'],
      variants: p.variants?.edges?.map((e: any) => ({ id: e.node.id })) || [{ id: p.id }],
      categoryId: 'women',
      subCategoryId: p.handle.includes('dress') ? 'dresses' : p.handle.includes('top') || p.handle.includes('shirt') ? 'shirts' : p.handle.includes('bag') ? 'accessories' : 'dresses',
      inStock: p.variants?.edges?.some((e: any) => e.node.availableForSale) ?? true
    }));
  }

  // Filter out current product and grab 3 items
  const items = finalRecommendations
    .filter((p) => p.id !== currentProductId && p.slug !== currentProductId)
    .slice(0, 3);

  if (items.length === 0) return null;

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-20 border-t border-onyx/10 my-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-800 mb-2">
            <Sparkles size={14} />
            <span className="font-metropolis text-[9px] tracking-[0.25em] uppercase font-semibold">
              Atelier Curated Pairing
            </span>
          </div>
          <h2 className="font-jost font-light text-2xl md:text-3xl tracking-[0.18em] uppercase text-stone-900">
            Complete The Look
          </h2>
        </div>
        <p className="font-inter text-xs text-stone-500 max-w-sm">
          Our stylists recommend pairing this piece with complementary textures and organic linen layers.
        </p>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group bg-white border border-onyx/5 flex flex-col justify-between hover:shadow-xl transition-all duration-300 min-w-[280px] sm:min-w-[320px] snap-center flex-shrink-0"
          >
            <div>
              <Link href={`/products/${item.slug}`} className="block relative aspect-[3/4] bg-[#F5EFE7] overflow-hidden mb-5">
                <Image
                  src={item.images[0] || '/placeholder.png'}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-3 right-3 z-10">
                  <WishlistButton
                    item={{
                      id: item.id,
                      handle: item.slug,
                      title: item.title,
                      price: item.price,
                      image: item.images[0] || '/placeholder.png',
                      subtext: item.subCategoryId
                    }}
                    size={18}
                  />
                </div>
              </Link>

              <div className="px-5">
                <span className="font-metropolis text-[9px] tracking-[0.2em] uppercase text-stone-400 block mb-1">
                  {item.subCategoryId || 'Companion Piece'}
                </span>
                <Link href={`/products/${item.slug}`}>
                  <h3 className="font-jost font-light text-base tracking-[0.15em] uppercase text-stone-900 line-clamp-1 hover:text-stone-600 transition-colors mb-2">
                    {item.title}
                  </h3>
                </Link>
                <span className="font-inter text-sm font-semibold text-stone-900 block mb-5">
                  ₹{item.price.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-5 pt-0 flex gap-2">
              <button
                onClick={() => {
                  addToCart({
                    id: item.id,
                    variantId: item.id,
                    title: item.title,
                    price: item.price,
                    image: item.images[0] || '/placeholder.png',
                    size: 'OS',
                    subtext: item.subCategoryId
                  });
                }}
                className="flex-1 bg-stone-900 text-white font-metropolis text-[9px] tracking-[0.2em] uppercase py-3.5 hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer font-medium"
              >
                <ShoppingBag size={13} /> Add To Look
              </button>
              <Link
                href={`/products/${item.slug}`}
                className="px-4 py-3 border border-stone-200 hover:border-black text-stone-700 flex items-center justify-center transition-colors"
                title="View piece"
              >
                <ArrowRight size={15} />
              </Link>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
