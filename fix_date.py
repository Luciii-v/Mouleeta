with open('src/components/ProductReviews.tsx', 'r') as f:
    content = f.read()

# Change the date format properly
content = content.replace(
    "new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })",
    "new Date(rev.createdAt).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })"
)

with open('src/components/ProductReviews.tsx', 'w') as f:
    f.write(content)
print("Updated date format in ProductReviews.tsx")
