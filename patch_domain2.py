with open('src/components/ProductReviews.tsx', 'r') as f:
    content = f.read()

content = content.replace("(window as any).jdgm.SHOP_DOMAIN = 'mouleeta.myshopify.com';", "(window as any).jdgm.SHOP_DOMAIN = 'kvd0hr-0x.myshopify.com';")

with open('src/components/ProductReviews.tsx', 'w') as f:
    f.write(content)
print("Patched domain")
