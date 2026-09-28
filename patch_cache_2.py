with open('src/components/ProductReviews.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "const res = await fetch(`/api/reviews?productId=${numericId}`, { cache: 'no-store' });", 
    "const res = await fetch(`/api/reviews?productId=${numericId}&t=${Date.now()}`, { cache: 'no-store' });"
)

with open('src/components/ProductReviews.tsx', 'w') as f:
    f.write(content)
print("Added timestamp cache buster")
