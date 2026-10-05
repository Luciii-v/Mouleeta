import { NextResponse } from "next/server";
import { getAllProducts, getCollections } from "@/lib/shopify";

// The search drawer needs only public catalog fields. Keep Shopify modules
// server-only and serve a bounded, cacheable response to the browser.
export const dynamic = "force-static";
export const revalidate = 300;

export async function GET() {
  const [products, collections] = await Promise.all([getAllProducts(), getCollections()]);
  const trendingTags = collections
    .filter((collection) => collection.handle !== "frontpage" && collection.handle !== "all")
    .slice(0, 6)
    .map((collection) => collection.title);

  return NextResponse.json({
    products: products.slice(0, 250).map((product) => {
      const variant = product.variants.length === 1 ? product.variants[0] : null;
      return {
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        description: product.description,
        images: product.images.slice(0, 5),
        subCategoryId: product.subCategoryId,
        variantId: variant && variant.stock > 0 ? variant.id : null,
        size: variant?.size || "OS",
      };
    }),
    trendingTags: trendingTags.length ? trendingTags : ["New Arrivals", "Dresses", "Shirts"],
  }, { headers: { "Cache-Control": "public, max-age=300" } });
}
