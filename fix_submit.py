with open('src/components/ProductReviews.tsx', 'r') as f:
    content = f.read()

content = content.replace("if (!reviewText || !authorName || !numericId) {", "const finalAuthorName = authorName || session?.user?.name;\n    if (!reviewText || !finalAuthorName || !numericId) {")
content = content.replace("authorName\n        })", "authorName: finalAuthorName\n        })")

with open('src/components/ProductReviews.tsx', 'w') as f:
    f.write(content)
print("Fixed handleSubmit")
