with open('next.config.mjs', 'r') as f:
    content = f.read()

# Fix scriptSrc string
content = content.replace(
    'const scriptSrc = "script-src \'self\' \'unsafe-inline\' https://cdn.shopify.com https://checkout.razorpay.com https://cdn1.judge.me https://judge.me;',
    'const scriptSrc = "script-src \'self\' \'unsafe-inline\' https://cdn.shopify.com https://checkout.razorpay.com https://cdn1.judge.me https://judge.me https://*.judge.me;";'
)

# Fix style-src
content = content.replace(
    '"style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com",',
    '"style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com https://cdn1.judge.me https://judge.me",',
)

# Fix connect-src
content = content.replace(
    'https://apiv2.shiprocket.in",',
    'https://apiv2.shiprocket.in https://judge.me",',
)

with open('next.config.mjs', 'w') as f:
    f.write(content)
print("Properly patched next.config.mjs")
