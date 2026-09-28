import re

with open('src/components/SearchModal.tsx', 'r') as f:
    content = f.read()

# Remove searchDatabase completely
content = re.sub(r'// Expanded editorial product database for rich live search\nconst searchDatabase = \[.*?\];\n', '', content, flags=re.DOTALL)

# Remove the fallback logic
content = content.replace('const searchDb = products.length > 0 ? products : searchDatabase;', '')
content = content.replace('searchDb.filter', 'products.filter')

with open('src/components/SearchModal.tsx', 'w') as f:
    f.write(content)
print("Removed searchDatabase fallback")
