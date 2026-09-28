import re

with open('src/components/ProductDetail.tsx', 'r') as f:
    content = f.read()

# Add import back
if "import ProductReviews from" not in content:
    content = content.replace("import RecentlyViewed from '@/components/RecentlyViewed';", "import RecentlyViewed from '@/components/RecentlyViewed';\nimport ProductReviews from '@/components/ProductReviews';")

# Add component back before the closing tags of the main content
if "<ProductReviews />" not in content:
    content = content.replace("      {/* Sticky Mobile \"Add to Cart\" Bar */}", "      <ProductReviews />\n\n      {/* Sticky Mobile \"Add to Cart\" Bar */}")

with open('src/components/ProductDetail.tsx', 'w') as f:
    f.write(content)
print("Added ProductReviews back")
