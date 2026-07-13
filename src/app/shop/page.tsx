import { getProducts } from '@/lib/shopify';
import ProductCard from '@/components/ProductCard';
import AnimatedGrid from '@/components/AnimatedGrid';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  // Fetching directly on the server—no client side useEffect needed
  const allProducts = await getProducts({});
  const products = allProducts.filter(p => !p.handle.includes('bag'));

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 md:px-16 lg:px-24">
      {/* Editorial Header */}
      <header className="mb-20 max-w-xl">
        <h1 className="text-[10px] uppercase tracking-[0.35em] text-neutral-500 mb-4 font-mono">
          Collections / All Products
        </h1>
        <p className="text-2xl font-light tracking-wide text-neutral-200 leading-relaxed font-jost">
          Structured silhouettes and deliberate minimalism. Designed for modern permanence.
        </p>
      </header>

      {/* Luxury Minimal Product Grid */}
      {products && products.length > 0 ? (
        <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
          {products.map((product) => (
            <ProductCard key={product.id} product={product as any} lightBg={false} />
          ))}
        </AnimatedGrid>
      ) : (
        /* Empty State */
        <div className="h-[50vh] flex flex-col items-center justify-center border border-neutral-900 rounded-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-mono mb-2">
            Warehouse Empty
          </p>
          <p className="text-sm text-neutral-600 font-light">
            No active products found in the Shopify deployment.
          </p>
        </div>
      )}
    </div>
  );
}
