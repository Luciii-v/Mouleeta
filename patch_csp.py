with open('next.config.mjs', 'r') as f:
    content = f.read()

import re

# Find the script-src in the CSP and append judge.me domains
# Currently it looks like: "script-src 'self' 'unsafe-inline' https://cdn.shopify.com https://checkout.razorpay.com;"

old_script_src = "script-src 'self' 'unsafe-inline' https://cdn.shopify.com https://checkout.razorpay.com;"
new_script_src = "script-src 'self' 'unsafe-inline' https://cdn.shopify.com https://checkout.razorpay.com https://cdn1.judge.me https://judge.me;"

if old_script_src in content:
    content = content.replace(old_script_src, new_script_src)
else:
    # Try more generic regex if it doesn't match exactly
    content = re.sub(r"script-src 'self' 'unsafe-inline' [^;]+;", "script-src 'self' 'unsafe-inline' https://cdn.shopify.com https://checkout.razorpay.com https://cdn1.judge.me https://judge.me;", content)

# Also add them to style-src if they fetch styles
old_style_src = "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;"
new_style_src = "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn1.judge.me https://judge.me;"

if old_style_src in content:
    content = content.replace(old_style_src, new_style_src)

# Also add to connect-src
old_connect_src = "connect-src 'self' https://kvd0hr-0x.myshopify.com https://api.razorpay.com wss://*;"
new_connect_src = "connect-src 'self' https://kvd0hr-0x.myshopify.com https://api.razorpay.com wss://* https://judge.me;"

if old_connect_src in content:
    content = content.replace(old_connect_src, new_connect_src)

with open('next.config.mjs', 'w') as f:
    f.write(content)
print("Patched CSP in next.config.mjs")
