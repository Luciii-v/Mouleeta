import React from 'react';
import Hero from '@/components/Hero';
import Collection from '@/components/Collection';
import Philosophy from '@/components/Philosophy';
import { getCollectionProducts, getProducts } from '@/lib/shopify';

export default async function Home() {
    let rawProducts = await getCollectionProducts('frontpage');

    if (!rawProducts || rawProducts.length === 0) {
      const activeProducts = await getProducts();
      rawProducts = activeProducts
        .filter(p => !p.handle.includes('bag'))
        .map(p => ({
        node: {
          id: p.id,
          title: p.title,
          handle: p.handle,
          description: p.description,
          priceRange: p.priceRange,
          featuredImage: p.images?.edges?.[0]?.node ? { url: p.images.edges[0].node.url } : undefined,
          variants: p.variants
        }
      })) as any;
    }

    return (
        <>
            <main>
                {/* Hero Section */}
                <Hero />

                {/* Spring Collection Product Grid */}
                <Collection products={rawProducts} />

                {/* Philosophy Quote Block */}
                <Philosophy />
            </main>
        </>
    );
}
