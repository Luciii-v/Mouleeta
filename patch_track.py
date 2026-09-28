import re

with open('src/app/track/page.tsx', 'r') as f:
    content = f.read()

# Remove the loadDemoOrder function
content = re.sub(r'const loadDemoOrder = \(id: string\) => \{.*?\};\n', '', content, flags=re.DOTALL)

# Remove the demo buttons UI block
# Search for the block starting with "Don't have an order number yet?"
demo_block_regex = r'\{/\* Demo orders for testing \*/\}.*?</div>\s*</div>'
content = re.sub(demo_block_regex, '', content, flags=re.DOTALL)

with open('src/app/track/page.tsx', 'w') as f:
    f.write(content)
print("Demo block removed")
