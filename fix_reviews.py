with open('src/app/api/reviews/route.ts', 'r') as f:
    content = f.read()

content = content.replace(
    "const reviewsRef = adminDb.collection('reviews').where('productId', '==', productId).orderBy('createdAt', 'desc');",
    "const reviewsRef = adminDb.collection('reviews').where('productId', '==', productId);"
)

content = content.replace(
    "const reviews = snapshot.docs.map(doc => ({\n      id: doc.id,\n      ...doc.data()\n    }));",
    "const reviews = snapshot.docs.map(doc => ({\n      id: doc.id,\n      ...doc.data()\n    })).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());"
)

with open('src/app/api/reviews/route.ts', 'w') as f:
    f.write(content)
print("Removed orderBy from query and added in-memory sort")
