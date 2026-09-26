import { MetadataRoute } from 'next';
import { shopifyFetch } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mouleeta.shop';

  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    // Fetch all products
    const query = `
      query getAllProducts {
        products(first: 250) {
          edges {
            node {
              handle
              updatedAt
            }
          }
        }
      }
    `;

    const res = await shopifyFetch<{ data: { products: { edges: Array<{ node: { handle: string; updatedAt: string } }> } } }>({
      query,
      cache: 'force-cache',
      tags: ['products']
    });

    const products = res.body?.data?.products?.edges || [];

    // Map products to sitemap entries
    const productRoutes: MetadataRoute.Sitemap = products.map((edge) => ({
      url: `${baseUrl}/products/${edge.node.handle}`,
      lastModified: new Date(edge.node.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...routes, ...productRoutes];
  } catch (error) {
    console.error('Failed to generate sitemap:', error);
    return routes;
  }
}
