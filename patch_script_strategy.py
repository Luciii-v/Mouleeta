with open('src/components/ProductReviews.tsx', 'r') as f:
    content = f.read()

# Change strategy of the settings script
content = content.replace('id="judgeme-settings" strategy="afterInteractive"', 'id="judgeme-settings" strategy="beforeInteractive"')

with open('src/components/ProductReviews.tsx', 'w') as f:
    f.write(content)
print("Patched script strategy")
