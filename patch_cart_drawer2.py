import re

with open('src/components/CartDrawer.tsx', 'r') as f:
    content = f.read()

# The trust icons section to remove:
# {/* Payment Trust Icons */}
# <div className="flex items-center justify-center gap-3 mt-4 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
# ...
# </div>
# Wait, let's just find the exact block and replace it with an empty string.

trust_icons_pattern = r'\{\s*/\*\s*Payment Trust Icons\s*\*/\s*\}.*?</svg>\s*</div>\s*</div>'

content = re.sub(trust_icons_pattern, '', content, flags=re.DOTALL)

with open('src/components/CartDrawer.tsx', 'w') as f:
    f.write(content)
print("Removed trust icons")
