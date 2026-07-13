import React from 'react';
import type { Metadata } from 'next';
import { getProductByHandle, getProducts } from '@/lib/shopify';
import ProductDetail from '@/components/ProductDetail';

interface Props {
  params: Promise<{
    handle: string;
  }>;
}

const siteUrl = 'https://mouleeta.shop';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return {
      title: 'Product Not Found | MOULEETA',
    };
  }

  const title = `${product.title} | MOULEETA`;
  const description = stripHtml(product.descriptionHtml) || 'Discover consciously crafted luxury from MOULEETA.';
  const image = product.images.edges[0]?.node;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/products/${product.handle}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/products/${product.handle}`,
      siteName: 'MOULEETA',
      type: 'website',
      images: image?.url
        ? [
            {
              url: image.url,
              width: 1200,
              height: 1600,
              alt: image.altText || product.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image?.url ? [image.url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  const allProducts = await getProducts();

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F9F8F6]">
        <h1 className="text-stone-500 tracking-widest uppercase text-sm">Product not found</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f1e8]">
      <ProductDetail product={product} allProducts={allProducts} />
    </main>
  );
}
