with open('src/components/SearchModal.tsx', 'r') as f:
    content = f.read()

# Replace the specific import block
old_block = """      // Fetch active Shopify products for search database on open
      import('@/lib/shopify')
        .then(({ getProducts }) => getProducts())
        .then((fetched) => {
          if (fetched && fetched.length > 0) {
            setProducts(
              fetched.map((p) => ({
                id: p.id,
                title: p.title,
                slug: p.handle,
                price: Math.round(parseFloat(p.priceRange?.minVariantPrice?.amount || '0')),
                description: p.description || '',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                images: p.images?.edges?.map((e: any) => e.node.url) || ['/placeholder.png'],
                subCategoryId: p.handle.includes('dress') ? 'dresses' : p.handle.includes('top') || p.handle.includes('shirt') ? 'shirts' : p.handle.includes('bag') ? 'accessories' : 'dresses'
              }))
            );
          }
        })
        .catch(console.error);"""

new_block = """      // Fetch active Shopify products and collections for search database on open
      import('@/lib/shopify')
        .then(({ getProducts, getCollections }) => {
          getProducts().then((fetched) => {
            if (fetched && fetched.length > 0) {
              setProducts(
                fetched.map((p) => ({
                  id: p.id,
                  title: p.title,
                  slug: p.handle,
                  price: Math.round(parseFloat(p.priceRange?.minVariantPrice?.amount || '0')),
                  description: p.description || '',
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  images: p.images?.edges?.map((e: any) => e.node.url) || ['/placeholder.png'],
                  subCategoryId: p.handle.includes('dress') ? 'dresses' : p.handle.includes('top') || p.handle.includes('shirt') ? 'shirts' : p.handle.includes('bag') ? 'accessories' : 'dresses'
                }))
              );
            }
          }).catch(console.error);
          
          getCollections().then((cols) => {
             const validCols = cols.filter(c => c.handle !== 'frontpage' && c.handle !== 'all').slice(0, 6);
             if (validCols.length > 0) {
               setTrendingTags(validCols.map(c => c.title));
             } else {
               setTrendingTags(['New Arrivals', 'Dresses', 'Shirts']);
             }
          }).catch(console.error);
        })
        .catch(console.error);"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open('src/components/SearchModal.tsx', 'w') as f:
        f.write(content)
    print("Replaced old block successfully")
else:
    print("Old block not found!")
