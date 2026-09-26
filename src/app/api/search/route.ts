export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ success: true, results: [] });
  }

  const query = `
    query searchProducts($query: String!) {
      search(query: $query, types: PRODUCT, first: 10) {
        edges {
          node {
            ... on Product {
              id
              title
              handle
              description
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  // Shopify storefront search supports wildcard matching on keywords
  const searchQuery = `*${q}*`;

  try {
    const res = await shopifyFetch<{
      data: {
        search: {
          edges: Array<{
            node: {
              id: string;
              title: string;
              handle: string;
              description: string;
              priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
              images: { edges: Array<{ node: { url: string; altText?: string } }> };
            }
          }>;
        };
      };
    }>({
      query,
      variables: { query: searchQuery },
      cache: 'no-store'
    });

    const edges = res.body?.data?.search?.edges || [];
    
    // Format to match what the frontend expects
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedResults = edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      slug: edge.node.handle,
      price: parseFloat(edge.node.priceRange.minVariantPrice.amount),
      description: edge.node.description || '',
      images: edge.node.images.edges.length > 0 ? [edge.node.images.edges[0].node.url] : ['/images/placeholder.jpg'],
      categoryId: "all",
      subCategoryId: "all",
      inStock: true
    }));

    return NextResponse.json({ success: true, results: formattedResults });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
