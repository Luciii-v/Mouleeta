import re

with open('src/components/ProductDetail.tsx', 'r') as f:
    content = f.read()

# 1. Import ProductReviews
if "import ProductReviews from '@/components/ProductReviews';" not in content:
    content = content.replace("import RecentlyViewed from '@/components/RecentlyViewed';", "import RecentlyViewed from '@/components/RecentlyViewed';\nimport ProductReviews from '@/components/ProductReviews';\nimport { Star } from 'lucide-react';")

# 2. Add Star Rating under Product Title
star_rating = """
          <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={14} fill="#1A1A1A" color="#1A1A1A" />
              ))}
            </div>
            <span className="font-metropolis text-[10px] uppercase tracking-[0.1em] text-[#1A1A1A] underline decoration-stone-300 underline-offset-4 hover:decoration-[#1A1A1A] transition-colors">
              124 Reviews
            </span>
          </div>
"""

title_match = r'(<h1 className="font-editorial text-3xl md:text-5xl lg:text-6xl text-\[#1A1A1A\] font-normal leading-tight mb-4">\s*\{product\.title\}\s*</h1>)'
content = re.sub(title_match, r'\1' + star_rating, content)

# 3. Add Low Stock Indicator right above Add To Bag
# We need to find the specific block where the Add to Bag button is.
# Look for {/* ADD TO BAG & WISHLIST (Desktop Only) */}
low_stock_indicator = """
          {/* Low Stock Indicator */}
          {selectedVariant?.availableForSale && (
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span className="font-inter text-xs font-medium text-stone-600">
                High demand. Only a few left in stock.
              </span>
            </div>
          )}
"""
content = content.replace('{/* ADD TO BAG & WISHLIST (Desktop Only) */}', low_stock_indicator + '\n          {/* ADD TO BAG & WISHLIST (Desktop Only) */}')

# 4. Inject ProductReviews at the bottom of the component.
# Usually right before:
#       {/* Sticky Mobile "Add to Cart" Bar */}
content = content.replace('{/* Sticky Mobile "Add to Cart" Bar */}', '<ProductReviews />\n\n      {/* Sticky Mobile "Add to Cart" Bar */}')

with open('src/components/ProductDetail.tsx', 'w') as f:
    f.write(content)
print("ProductDetail patched.")
