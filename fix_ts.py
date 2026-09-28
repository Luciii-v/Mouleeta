with open('src/app/api/reviews/route.ts', 'r') as f:
    content = f.read()

content = content.replace(
    "const reviews = snapshot.docs.map(doc => ({\n      id: doc.id,\n      ...doc.data()\n    })).sort((a: { createdAt: string }, b: { createdAt: string }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());",
    "const rawReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));\n    const reviews = rawReviews.sort((a, b) => {\n      const dateA = (a as {createdAt?: string}).createdAt || '';\n      const dateB = (b as {createdAt?: string}).createdAt || '';\n      return new Date(dateB).getTime() - new Date(dateA).getTime();\n    });"
)

with open('src/app/api/reviews/route.ts', 'w') as f:
    f.write(content)
print("Fixed TS error")
