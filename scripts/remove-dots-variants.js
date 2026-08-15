/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.resolve(__dirname, '../.env.local'), 'utf-8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || process.env.SHOPIFY_ACCESS_TOKEN;
const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const API_VERSION = '2024-01';

async function removeDotsVariants() {
  if (!ACCESS_TOKEN || !STORE_DOMAIN) {
    console.error('Missing Shopify credentials in .env.local');
    return;
  }

  const endpoint = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

  const getProductsQuery = `
    query getProducts($cursor: String) {
      products(first: 50, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            variants(first: 50) {
              edges {
                node {
                  id
                  title
                }
              }
            }
          }
        }
      }
    }
  `;

  const deleteVariantMutation = `
    mutation productVariantDelete($id: ID!) {
      productVariantDelete(id: $id) {
        deletedProductVariantId
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    let hasNextPage = true;
    let cursor = null;
    let deletedCount = 0;

    console.log('Fetching products to find "Dots" variants...');

    while (hasNextPage) {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': ACCESS_TOKEN,
        },
        body: JSON.stringify({
          query: getProductsQuery,
          variables: { cursor }
        }),
      });

      const { data, errors } = await response.json();

      if (errors) {
        console.error('GraphQL Errors:', JSON.stringify(errors, null, 2));
        return;
      }

      const products = data.products.edges;

      for (const { node: product } of products) {
        const variants = product.variants.edges;
        for (const { node: variant } of variants) {
          if (variant.title.toLowerCase().includes('dots')) {
            console.log(`Found "Dots" variant for product: ${product.title} (Variant ID: ${variant.id})`);
            
            // Delete the variant
            const delRes = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': ACCESS_TOKEN,
              },
              body: JSON.stringify({
                query: deleteVariantMutation,
                variables: { id: variant.id }
              }),
            });
            
            const delData = await delRes.json();
            if (delData.data?.productVariantDelete?.userErrors?.length > 0) {
              console.error(`Error deleting variant ${variant.id}:`, delData.data.productVariantDelete.userErrors);
            } else {
              console.log(`Successfully deleted variant ${variant.id}`);
              deletedCount++;
            }
          }
        }
      }

      hasNextPage = data.products.pageInfo.hasNextPage;
      cursor = data.products.pageInfo.endCursor;
    }

    console.log(`Finished. Deleted ${deletedCount} "Dots" variants.`);
  } catch (error) {
    console.error('Script failed:', error);
  }
}

removeDotsVariants();
