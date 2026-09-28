with open('src/components/ProductReviews.tsx', 'r') as f:
    content = f.read()

# Change the date format
content = content.replace(
    "new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })",
    "new Date(review.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })"
)

with open('src/components/ProductReviews.tsx', 'w') as f:
    f.write(content)
print("Updated date format in ProductReviews.tsx")
