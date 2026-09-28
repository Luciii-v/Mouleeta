with open('src/components/ProductReviews.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "const res = await fetch(`/api/reviews?productId=${numericId}`);", 
    "const res = await fetch(`/api/reviews?productId=${numericId}`, { cache: 'no-store' });"
)

with open('src/components/ProductReviews.tsx', 'w') as f:
    f.write(content)
print("Added cache: no-store")
