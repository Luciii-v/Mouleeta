with open('src/app/api/search/route.ts', 'r') as f:
    content = f.read()

content = content.replace("const formattedResults = edges.map((edge) => ({", "const formattedResults = edges.map((edge: any) => ({")

with open('src/app/api/search/route.ts', 'w') as f:
    f.write(content)
