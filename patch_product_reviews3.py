import re
with open('src/components/ProductDetail.tsx', 'r') as f:
    content = f.read()

# Pass props to ProductReviews
content = content.replace("<ProductReviews />", "<ProductReviews productId={product.id} productHandle={product.handle} />")

with open('src/components/ProductDetail.tsx', 'w') as f:
    f.write(content)
