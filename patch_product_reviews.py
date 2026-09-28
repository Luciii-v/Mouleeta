import re
with open('src/components/ProductDetail.tsx', 'r') as f:
    content = f.read()

content = content.replace("import ProductReviews from '@/components/ProductReviews';", "")
content = content.replace("<ProductReviews />", "")

with open('src/components/ProductDetail.tsx', 'w') as f:
    f.write(content)
print("Removed ProductReviews")
