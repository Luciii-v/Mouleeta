import { Product, ProductVariant } from '@/types/product';

// Retrieve Shopify configuration from environment variables
const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';
const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-04';

// Check if Shopify integration is configured
const isConfigured = Boolean(domain && accessToken);

export const ALLOWED_HANDLES = [
  'collar-dress',
  'backless-top',
  'backless-dress',
  'blue-bag',
  'pink-bag',
  'slit-dress',
  'tie-n-dye',
  'short-dress',
  'co-ord-sets'
];

// Internal Interfaces for Shopify GraphQL Storefront API responses
interface ShopifyImageNode {
  node: {
    url: string;
    altText?: string;
  };
}

interface ShopifyVariantNode {
  node: {
    id: string;
    title: string;
    sku?: string;
    availableForSale: boolean;
    quantityAvailable?: number;
    price: {
      amount: string;
    };
    selectedOptions: {
      name: string;
      value: string;
    }[];
  };
}

interface ShopifyProductNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: {
    edges: ShopifyImageNode[];
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode?: string;
    };
  };
  variants: {
    edges: ShopifyVariantNode[];
  };
  tags: string[];
  collections: {
    edges: {
      node: {
        title: string;
        handle: string;
      };
    }[];
  };
}

interface ShopifyCartNode {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: {
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          price: {
            amount: string;
          };
          product: {
            title: string;
            handle: string;
          };
        };
      };
    }[];
  };
}

export interface ShopifyCollectionResult {
  title: string;
  description: string;
  image?: { url: string };
  products: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        handle: string;
        priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
        images: { edges: Array<{ node: { url: string; altText?: string } }> };
      };
    }>;
  };
}

export interface ShopifyProductDetailResult {
  id: string;
  title: string;
  handle: string;
  descriptionHtml: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: Array<{ node: { url: string; altText?: string } }> };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: { amount: string; currencyCode: string };
      };
    }>;
  };
}

export interface ShopifyCollectionProductEdge {
  node: {
    id: string;
    title: string;
    handle: string;
    description?: string;
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
    featuredImage?: { url: string; altText?: string };
    images?: {
      edges: Array<{
        node: {
          url: string;
          altText?: string;
        };
      }>;
    };
    variants: { edges: Array<{ node: { id: string } }> };
  };
}

/**
 * Custom fetch wrapper to interact with the Shopify Storefront GraphQL API
 */
async function shopifyFetch<T>({
  query,
  variables = {},
  cache = 'force-cache',
  tags = []
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  tags?: string[];
}): Promise<{ status: number; body: T } | never> {
  if (!isConfigured) {
    throw new Error(
      'Shopify integration environment variables are missing.\n' +
      'Please add NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN to your .env.local file.'
    );
  }

  try {
    const result = await fetch(
      `https://${domain}/api/${apiVersion}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': accessToken
        },
        body: JSON.stringify({
          query,
          variables
        }),
        cache,
        ...(tags.length > 0 ? { next: { tags } } : {})
      }
    );

    const body = await result.json();

    if (body.errors) {
      throw new Error(body.errors[0].message);
    }

    return {
      status: result.status,
      body
    };
  } catch (error: unknown) {
    console.error('Error fetching from Shopify Storefront API:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch from Shopify';
    throw new Error(message);
  }
}

/**
 * Maps the Shopify GraphQL Product Node to the local client Product format
 */
function mapShopifyProductToLocalProduct(node: ShopifyProductNode): Product {
  const tags = node.tags || [];
  const collections = node.collections?.edges?.map((e) => e.node.handle) || [];

  // Parse category & subcategory from collections and tags
  let categoryId = 'women'; // Default category
  let subCategoryId = 'dresses'; // Default subcategory

  if (tags.includes('women') || collections.includes('women')) {
    categoryId = 'women';
  } else if (tags.includes('men') || collections.includes('men')) {
    categoryId = 'men';
  }

  // Identify matching subcategory
  const subCategories = ['dresses', 'shirts', 'pants'];
  for (const sub of subCategories) {
    if (tags.includes(sub) || collections.includes(sub)) {
      subCategoryId = sub;
      break;
    }
  }

  // Parse Shopify product variants into our local ProductVariant format
  const variants: ProductVariant[] = node.variants.edges.map((edge) => {
    const v = edge.node;
    const sizeOption = v.selectedOptions.find((o) => o.name.toLowerCase() === 'size');
    const colorOption = v.selectedOptions.find((o) => o.name.toLowerCase() === 'color');

    return {
      id: v.id,
      size: sizeOption ? sizeOption.value : 'OS', // OS = One Size
      color: colorOption ? colorOption.value : undefined,
      sku: v.sku || undefined,
      price: v.price ? Math.round(parseFloat(v.price.amount)) : undefined,
      stock: v.quantityAvailable !== undefined && v.quantityAvailable !== null
        ? v.quantityAvailable
        : (v.availableForSale ? 10 : 0) // Graceful stock fallback
    };
  });

  const inStock = node.variants.edges.some((edge) => edge.node.availableForSale);

  return {
    id: node.id,
    title: node.title,
    slug: node.handle,
    price: Math.round(parseFloat(node.priceRange.minVariantPrice.amount)),
    description: node.description,
    images: node.images.edges.map((edge) => edge.node.url),
    categoryId,
    subCategoryId,
    variants,
    inStock
  };
}

// ============================================================================
// Storefront Queries
// ============================================================================

/**
 * Fetches all products and returns them in the Shopify-native format
 * expected by the minimal luxury gallery template.
 */
export async function getProducts(options?: Record<string, unknown>): Promise<ShopifyProductNode[]> {
  void options;
  const query = `
    query GetProducts {
      products(first: 250) {
        edges {
          node {
            id
            title
            handle
            description
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await shopifyFetch<{
      data: {
        products: {
          edges: { node: ShopifyProductNode }[];
        };
      };
    }>({ query, cache: 'no-store', tags: ['products'] });

    const allProducts = res.body.data.products.edges.map((edge) => edge.node);
    return allProducts.filter(p => ALLOWED_HANDLES.includes(p.handle));
  } catch (error) {
    console.error('Failed to get raw products, using fallback:', error);
    return [];
  }
}

const productsFragment = `
  fragment ProductDetails on Product {
    id
    title
    handle
    description
    images(first: 10) {
      edges {
        node {
          url
          altText
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          sku
          availableForSale
          quantityAvailable
          price {
            amount
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
    tags
    collections(first: 10) {
      edges {
        node {
          title
          handle
        }
      }
    }
  }
`;

/**
 * Fetches all products from Shopify and maps them to local Product types
 */
export async function getAllProducts(): Promise<Product[]> {
  const query = `
    query GetProducts {
      products(first: 250) {
        edges {
          node {
            ...ProductDetails
          }
        }
      }
    }
    ${productsFragment}
  `;

  try {
    const res = await shopifyFetch<{
      data: {
        products: {
          edges: { node: ShopifyProductNode }[];
        };
      };
    }>({ query, cache: 'force-cache', tags: ['products'] });

    return res.body.data.products.edges.map((edge) =>
      mapShopifyProductToLocalProduct(edge.node)
    );
  } catch (error) {
    console.error('Failed to get products, using fallback:', error);
    return [];
  }
}

/**
 * Fetches a single product by its handle/slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const query = `
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        ...ProductDetails
      }
    }
    ${productsFragment}
  `;

  try {
    const res = await shopifyFetch<{
      data: {
        product: ShopifyProductNode | null;
      };
    }>({
      query,
      variables: { handle: slug },
      cache: 'force-cache',
      tags: [`product-${slug}`]
    });

    const product = res.body.data.product;
    return product ? mapShopifyProductToLocalProduct(product) : null;
  } catch (error) {
    console.error(`Failed to get product ${slug}:`, error);
    return null;
  }
}

/**
 * Fetches products filtered by category or subcategory
 */
export async function getProductsByCategory(
  category: string,
  subCategory?: string
): Promise<Product[]> {
  // Try querying by collection first (Shopify best practice)
  const collectionHandle = subCategory ? `${category}-${subCategory}` : category;

  const query = `
    query GetCollectionProducts($handle: String!) {
      collection(handle: $handle) {
        products(first: 250) {
          edges {
            node {
              ...ProductDetails
            }
          }
        }
      }
    }
    ${productsFragment}
  `;

  try {
    const res = await shopifyFetch<{
      data: {
        collection: {
          products: {
            edges: { node: ShopifyProductNode }[];
          };
        } | null;
      };
    }>({
      query,
      variables: { handle: collectionHandle.toLowerCase() },
      cache: 'force-cache',
      tags: [`collection-${collectionHandle}`]
    });

    const collection = res.body.data.collection;
    if (collection) {
      return collection.products.edges.map((edge) =>
        mapShopifyProductToLocalProduct(edge.node)
      );
    }

    // Fallback: fetch all and filter client-side if collection not found
    const allProducts = await getAllProducts();
    return allProducts.filter((product) => {
      const matchCategory = product.categoryId.toLowerCase() === category.toLowerCase();
      const matchSubCategory = subCategory
        ? product.subCategoryId.toLowerCase() === subCategory.toLowerCase()
        : true;
      return matchCategory && matchSubCategory;
    });
  } catch (error) {
    console.error(`Failed to get collection products: ${collectionHandle}`, error);
    return [];
  }
}

// ============================================================================
// Cart/Checkout Actions
// ============================================================================

/**
 * Creates a new Shopify checkout cart session
 */
export async function createCart(): Promise<{ id: string; checkoutUrl: string } | null> {
  const query = `
    mutation CreateCart {
      cartCreate {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `;

  try {
    const res = await shopifyFetch<{
      data: {
        cartCreate: {
          cart: {
            id: string;
            checkoutUrl: string;
          };
        };
      };
    }>({ query, cache: 'no-store' });

    return res.body.data.cartCreate.cart;
  } catch (error) {
    console.error('Failed to create Shopify cart:', error);
    return null;
  }
}

/**
 * Retrieves the details of a cart by its ID
 */
export async function getCart(cartId: string): Promise<ShopifyCartNode | null> {
  const query = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await shopifyFetch<{
      data: {
        cart: ShopifyCartNode | null;
      };
    }>({
      query,
      variables: { cartId },
      cache: 'no-store'
    });

    return res.body.data.cart;
  } catch (error) {
    console.error(`Failed to get Shopify cart ${cartId}:`, error);
    return null;
  }
}

/**
 * Adds line items to an existing Shopify cart
 */
export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<ShopifyCartNode | null> {
  const query = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                    }
                    product {
                      title
                      handle
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await shopifyFetch<{
      data: {
        cartLinesAdd: {
          cart: ShopifyCartNode;
        };
      };
    }>({
      query,
      variables: { cartId, lines },
      cache: 'no-store'
    });

    return res.body.data.cartLinesAdd.cart;
  } catch (error) {
    console.error(`Failed to add lines to cart ${cartId}:`, error);
    return null;
  }
}

export async function getCollectionByHandle(handle: string): Promise<ShopifyCollectionResult | null> {
  const query = `
    query getCollection($handle: String!) {
      collection(handle: $handle) {
        title
        description
        image {
          url
        }
        products(first: 20) {
          edges {
            node {
              id
              title
              handle
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 2) {
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

  try {
    const res = await shopifyFetch<{ data: { collection: ShopifyCollectionResult } }>({
      query,
      variables: { handle },
      cache: 'force-cache',
      tags: [`collection-${handle}`]
    });
    return res.body?.data?.collection || null;
  } catch (error) {
    console.error(`Failed to get collection by handle ${handle}:`, error);
    return null;
  }
}

export async function getProductByHandle(handle: string): Promise<ShopifyProductDetailResult | null> {
  if (!ALLOWED_HANDLES.includes(handle)) {
    return null;
  }

  const query = `
    query getProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        descriptionHtml
        priceRange { minVariantPrice { amount currencyCode } }
        images(first: 50) { edges { node { url altText } } }
        variants(first: 10) {
          edges {
            node {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await shopifyFetch<{ data: { product: ShopifyProductDetailResult } }>({
      query,
      variables: { handle },
      cache: 'force-cache',
      tags: [`product-${handle}`]
    });
    return res.body?.data?.product || null;
  } catch (error) {
    console.error(`Failed to get product by handle ${handle}:`, error);
    return null;
  }
}

export async function getCollectionProducts(handle: string = 'frontpage'): Promise<ShopifyCollectionProductEdge[]> {
  const query = `
    query getCollectionProducts($handle: String!) {
      collection(handle: $handle) {
        title
        products(first: 250) {
          edges {
            node {
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
              images(first: 2) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await shopifyFetch<{ data: { collection: { products: { edges: ShopifyCollectionProductEdge[] } } } }>({
      query,
      variables: { handle },
      cache: 'no-store',
      tags: [`collection-products-${handle}`]
    });

    const edges = res.body?.data?.collection?.products?.edges || [];
    if (edges.length > 0) {
      return edges.filter(edge => {
        const isAllowed = ALLOWED_HANDLES.includes(edge.node.handle);
        if (!isAllowed) return false;
        
        const handleLower = handle.toLowerCase();
        const isFeed = handleLower === 'frontpage' || handleLower === 'new-arrivals' || handleLower === 'spring-collection' || handleLower === 'spring';
        if (isFeed && edge.node.handle.includes('bag')) {
          return false;
        }
        return true;
      });
    }

    // Fallback: If collection not found or empty on Shopify, query all products and filter client-side
    // using title keywords & tags to match the collection handle.
    const allProductsQuery = `
      query GetAllProductsFallback {
        products(first: 250) {
          edges {
            node {
              id
              title
              handle
              description
              tags
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
              variants(first: 1) {
                edges {
                  node {
                    id
                  }
                }
              }
            }
          }
        }
      }
    `;

    const allRes = await shopifyFetch<{
      data: {
        products: {
          edges: Array<{
            node: {
              id: string;
              title: string;
              handle: string;
              description?: string;
              tags: string[];
              priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
              images: { edges: Array<{ node: { url: string; altText?: string } }> };
              variants: { edges: Array<{ node: { id: string } }> };
            }
          }>;
        };
      };
    }>({ query: allProductsQuery, cache: 'no-store' });

    const allEdges = (allRes.body?.data?.products?.edges || []).filter(edge => ALLOWED_HANDLES.includes(edge.node.handle));
    
    // Filter based on the requested handle
    const filteredEdges = allEdges.filter((edge) => {
      const title = edge.node.title.toLowerCase();
      const tags = (edge.node.tags || []).map(t => t.toLowerCase());
      const handleLower = handle.toLowerCase();

      if (handleLower === 'frontpage' || handleLower === 'new-arrivals' || handleLower === 'spring-collection' || handleLower === 'spring') {
        return !edge.node.handle.includes('bag');
      }

      if (handleLower === 'shirts') {
        return title.includes('shirt') || title.includes('top') || tags.includes('shirts') || tags.includes('shirt') || tags.includes('top');
      }
      
      if (handleLower === 'dresses') {
        return title.includes('dress') || title.includes('gown') || tags.includes('dresses') || tags.includes('dress') || tags.includes('gown');
      }
      
      if (handleLower === 'trousers' || handleLower === 'pants') {
        return title.includes('trousers') || title.includes('pants') || title.includes('pant') || tags.includes('trousers') || tags.includes('pants') || tags.includes('pant');
      }
      
      if (handleLower === 'co-ords' || handleLower === 'co-ord' || handleLower === 'co-ord-sets') {
        return title.includes('coord') || title.includes('co-ord') || title.includes('suit') || title.includes('set') || tags.includes('co-ords') || tags.includes('co-ord') || tags.includes('coords') || tags.includes('coord');
      }

      if (handleLower === 'tie-n-dye' || handleLower === 'tie-dye') {
        return title.includes('tie') || title.includes('dye') || tags.includes('tie') || tags.includes('dye');
      }

      if (handleLower === 'accessories' || handleLower === 'bags') {
        return title.includes('bag') || tags.includes('accessories') || tags.includes('bags') || tags.includes('bag');
      }

      // Default string match fallback
      return title.includes(handleLower) || tags.includes(handleLower);
    });

    // Map to ShopifyCollectionProductEdge structure
    return filteredEdges.map((edge) => ({
      node: {
        id: edge.node.id,
        title: edge.node.title,
        handle: edge.node.handle,
        description: edge.node.description,
        priceRange: edge.node.priceRange,
        featuredImage: edge.node.images?.edges?.[0]?.node,
        images: edge.node.images,
        variants: edge.node.variants
      }
    }));

  } catch (error) {
    console.error(`Failed to get collection products by handle ${handle}:`, error);
    return [];
  }
}
