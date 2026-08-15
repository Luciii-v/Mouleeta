/**
 * MOULEETA — Shopify Inventory Update Script
 * ============================================
 * Updates product variants and inventory from the IKKAT Product Sheet PDF data.
 *
 * Prerequisites:
 *   - Admin token with scopes: read_products, write_products, read_inventory, write_inventory
 *   - Run: node scripts/update-inventory.js
 *
 * Data source: MOULEETA PRODUCT SHEET - IKKAT.pdf
 */

require('dotenv').config({ path: '.env.local' });

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-04';

// ============================================================
// INVENTORY DATA FROM PDF (MOULEETA PRODUCT SHEET - IKKAT)
// ============================================================
// Format: ML001_XS_00 = SKU: ML001, Size: XS, Stock: 0
// Only ML_001 had clear inventory in the PDF. Update other
// products (marked with // UPDATE FROM RECORDS) manually.

const INVENTORY_DATA = {
  // Backless Dress → ML_001 (Midnight Blue Ikat Cotton Maxi Dress)
  'backless-dress': {
    title: 'Backless Dress',
    variants: [
      { size: 'XS', sku: 'ML001-XS', stock: 0 },
      { size: 'S',  sku: 'ML001-S',  stock: 5 },
      { size: 'M',  sku: 'ML001-M',  stock: 4 },
      { size: 'L',  sku: 'ML001-L',  stock: 6 },
      { size: 'XL', sku: 'ML001-XL', stock: 4 },
    ],
  },

  // Backless Top → ML_003 (Midnight Blue Ikat Cotton Halter Top)
  'backless-top': {
    title: 'Backless Top',
    variants: [
      { size: 'XS', sku: 'ML003-XS', stock: 0 }, // UPDATE FROM RECORDS
      { size: 'S',  sku: 'ML003-S',  stock: 0 }, // UPDATE FROM RECORDS
      { size: 'M',  sku: 'ML003-M',  stock: 0 }, // UPDATE FROM RECORDS
      { size: 'L',  sku: 'ML003-L',  stock: 0 }, // UPDATE FROM RECORDS
      { size: 'XL', sku: 'ML003-XL', stock: 0 }, // UPDATE FROM RECORDS
    ],
  },

  // Collar Dress → ML_007 (Midnight Blue Ikat Cotton Shirt Dress)
  'collar-dress': {
    title: 'Collar Dress',
    variants: [
      { size: 'XS', sku: 'ML007-XS', stock: 0 }, // UPDATE FROM RECORDS
      { size: 'S',  sku: 'ML007-S',  stock: 0 }, // UPDATE FROM RECORDS
      { size: 'M',  sku: 'ML007-M',  stock: 0 }, // UPDATE FROM RECORDS
      { size: 'L',  sku: 'ML007-L',  stock: 0 }, // UPDATE FROM RECORDS
      { size: 'XL', sku: 'ML007-XL', stock: 0 }, // UPDATE FROM RECORDS
    ],
  },

  // Slit Dress → ML_005 (Midnight Blue Ikat Cotton Slip Dress)
  'slit-dress': {
    title: 'Slit Dress',
    variants: [
      { size: 'XS', sku: 'ML005-XS', stock: 0 }, // UPDATE FROM RECORDS
      { size: 'S',  sku: 'ML005-S',  stock: 0 }, // UPDATE FROM RECORDS
      { size: 'M',  sku: 'ML005-M',  stock: 0 }, // UPDATE FROM RECORDS
      { size: 'L',  sku: 'ML005-L',  stock: 0 }, // UPDATE FROM RECORDS
      { size: 'XL', sku: 'ML005-XL', stock: 0 }, // UPDATE FROM RECORDS
    ],
  },

  // Short Dress → ML_008 (Blush Pink Ikat Cotton Shirt Dress)
  'short-dress': {
    title: 'Short Dress',
    variants: [
      { size: 'XS', sku: 'ML008-XS', stock: 0 }, // UPDATE FROM RECORDS
      { size: 'S',  sku: 'ML008-S',  stock: 0 }, // UPDATE FROM RECORDS
      { size: 'M',  sku: 'ML008-M',  stock: 0 }, // UPDATE FROM RECORDS
      { size: 'L',  sku: 'ML008-L',  stock: 0 }, // UPDATE FROM RECORDS
      { size: 'XL', sku: 'ML008-XL', stock: 0 }, // UPDATE FROM RECORDS
    ],
  },

  // Tie n Dye
  'tie-n-dye': {
    title: 'Tie n Dye',
    variants: [
      { size: 'XS', sku: 'TNDYE-XS', stock: 0 }, // UPDATE FROM RECORDS
      { size: 'S',  sku: 'TNDYE-S',  stock: 0 }, // UPDATE FROM RECORDS
      { size: 'M',  sku: 'TNDYE-M',  stock: 0 }, // UPDATE FROM RECORDS
      { size: 'L',  sku: 'TNDYE-L',  stock: 0 }, // UPDATE FROM RECORDS
      { size: 'XL', sku: 'TNDYE-XL', stock: 0 }, // UPDATE FROM RECORDS
    ],
  },

  // Co-ord Sets
  'co-ord-sets': {
    title: 'Co-ord Sets',
    variants: [
      { size: 'XS', sku: 'CORD-XS', stock: 0 }, // UPDATE FROM RECORDS
      { size: 'S',  sku: 'CORD-S',  stock: 0 }, // UPDATE FROM RECORDS
      { size: 'M',  sku: 'CORD-M',  stock: 0 }, // UPDATE FROM RECORDS
      { size: 'L',  sku: 'CORD-L',  stock: 0 }, // UPDATE FROM RECORDS
      { size: 'XL', sku: 'CORD-XL', stock: 0 }, // UPDATE FROM RECORDS
    ],
  },
};

// ============================================================
// Shopify Admin API helper
// ============================================================

async function adminFetch(query, variables = {}) {
  const res = await fetch(
    `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    }
  );
  const json = await res.json();
  if (json.errors) {
    throw new Error(JSON.stringify(json.errors, null, 2));
  }
  return json.data;
}

async function getProductByHandle(handle) {
  const data = await adminFetch(`
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id title handle
        variants(first: 50) {
          edges {
            node {
              id title sku
              inventoryItem { id }
              inventoryQuantity
            }
          }
        }
      }
    }
  `, { handle });
  return data.productByHandle;
}

async function getLocationId() {
  const data = await adminFetch(`
    query { locations(first: 1) { edges { node { id name } } } }
  `);
  const location = data.locations.edges[0]?.node;
  if (!location) throw new Error('No Shopify location found');
  console.log(`📍 Location: ${location.name} (${location.id})`);
  return location.id;
}

async function updateProductVariants(productId, variantData) {
  const variantsInput = variantData.map(v => ({
    optionValues: [{ optionName: 'Size', name: v.size }],
    sku: v.sku,
    inventoryManagement: 'SHOPIFY',
    inventoryPolicy: 'DENY',
  }));

  await adminFetch(`
    mutation updateOptions($productId: ID!, $options: [OptionCreateInput!]!) {
      productOptionsCreate(productId: $productId, options: $options) {
        userErrors { field message }
      }
    }
  `, {
    productId,
    options: [{ name: 'Size', values: variantData.map(v => ({ name: v.size })) }],
  });

  const createData = await adminFetch(`
    mutation bulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkCreate(productId: $productId, variants: $variants) {
        productVariants {
          id title sku
          inventoryItem { id }
        }
        userErrors { field message }
      }
    }
  `, { productId, variants: variantsInput });

  const errors = createData.productVariantsBulkCreate?.userErrors;
  if (errors?.length) console.warn('  ⚠️  Variant create errors:', errors);

  return createData.productVariantsBulkCreate?.productVariants || [];
}

async function setInventory(inventoryItemId, locationId, quantity) {
  await adminFetch(`
    mutation activate($inventoryItemId: ID!, $locationId: ID!) {
      inventoryActivate(inventoryItemId: $inventoryItemId, locationId: $locationId) {
        inventoryLevel { id }
        userErrors { field message }
      }
    }
  `, { inventoryItemId, locationId });

  const data = await adminFetch(`
    mutation setQty($input: InventorySetQuantitiesInput!) {
      inventorySetQuantities(input: $input) {
        inventoryAdjustmentGroup { id }
        userErrors { field message }
      }
    }
  `, {
    input: {
      name: 'available',
      reason: 'correction',
      quantities: [{ inventoryItemId, locationId, quantity }],
    },
  });

  const errors = data.inventorySetQuantities?.userErrors;
  if (errors?.length) console.warn('    ⚠️  Inventory errors:', errors);
}

async function main() {
  console.log('🛍️  MOULEETA — Shopify Inventory Update\n');

  if (!STORE_DOMAIN || !ADMIN_TOKEN) {
    console.error('❌ Missing env vars. Check .env.local');
    process.exit(1);
  }

  let locationId;
  try {
    locationId = await getLocationId();
  } catch (e) {
    console.error('❌ Failed to get location (check Admin token scopes — need read_inventory):', e.message);
    process.exit(1);
  }

  for (const [handle, data] of Object.entries(INVENTORY_DATA)) {
    console.log(`\n📦 Processing: ${data.title} (${handle})`);

    let product;
    try {
      product = await getProductByHandle(handle);
    } catch (e) {
      console.error(`  ❌ Failed to fetch (check read_products scope): ${e.message}`);
      continue;
    }

    if (!product) {
      console.warn(`  ⚠️  Not found in Shopify: ${handle}`);
      continue;
    }

    console.log(`  ✅ Found: ${product.id}`);

    const existingVariants = product.variants.edges.map(e => e.node);
    const hasDefaultOnly = existingVariants.length === 1 && existingVariants[0].title === 'Default Title';

    let variantsToUpdate = existingVariants;

    if (hasDefaultOnly) {
      console.log(`  🔄 Adding size variants...`);
      try {
        const newVariants = await updateProductVariants(product.id, data.variants);
        variantsToUpdate = newVariants;
        console.log(`  ✅ Created ${newVariants.length} size variants`);
      } catch (e) {
        console.error(`  ❌ Failed to create variants (check write_products scope): ${e.message}`);
        continue;
      }
    }

    for (const variantInventory of data.variants) {
      const matchingVariant = variantsToUpdate.find(v =>
        v.title?.toLowerCase().includes(variantInventory.size.toLowerCase()) ||
        v.sku === variantInventory.sku
      );

      if (!matchingVariant?.inventoryItem?.id) {
        console.warn(`  ⚠️  No variant/inventoryItem for size ${variantInventory.size}`);
        continue;
      }

      try {
        await setInventory(matchingVariant.inventoryItem.id, locationId, variantInventory.stock);
        console.log(`  📊 ${variantInventory.size}: ${variantInventory.stock} pcs → ✅`);
      } catch (e) {
        console.error(`  ❌ Inventory update failed for ${variantInventory.size}: ${e.message}`);
      }
    }
  }

  console.log('\n✅ Done! Verify in Shopify Admin → Products → each product → Variants');
}

main().catch(console.error);
