with open('src/app/api/reviews/route.ts', 'r') as f:
    content = f.read()

content = content.replace(
    ".sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());",
    ".sort((a: { createdAt: string }, b: { createdAt: string }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());"
)

with open('src/app/api/reviews/route.ts', 'w') as f:
    f.write(content)
print("Fixed any types")
