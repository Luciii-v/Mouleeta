import re
with open('src/components/ProductReviews.tsx', 'r') as f:
    content = f.read()

# Replace the Script tag for settings with standard script
old_settings = """        {/* Judge.me Settings & Preloader */}
        <Script id="judgeme-settings" strategy="beforeInteractive">
          {`
            window.jdgm = window.jdgm || {};
            window.jdgm.SHOP_DOMAIN = 'kvd0hr-0x.myshopify.com'; 
          `}
        </Script>
        <Script src="https://cdn1.judge.me/widget_preloader.js" strategy="afterInteractive" />"""

new_settings = """        {/* Judge.me Settings & Preloader */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.jdgm = window.jdgm || {};
              window.jdgm.SHOP_DOMAIN = 'kvd0hr-0x.myshopify.com';
            `,
          }}
        />
        <Script src="https://cdn1.judge.me/widget_preloader.js" strategy="afterInteractive" />"""

if old_settings in content:
    content = content.replace(old_settings, new_settings)
else:
    print("Could not find the exact string to replace. Attempting fallback.")
    old_settings_fallback = """        <Script id="judgeme-settings" strategy="afterInteractive">
          {`
            window.jdgm = window.jdgm || {};
            window.jdgm.SHOP_DOMAIN = 'kvd0hr-0x.myshopify.com'; 
          `}
        </Script>"""
    if old_settings_fallback in content:
         content = content.replace(old_settings_fallback, """        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.jdgm = window.jdgm || {};
              window.jdgm.SHOP_DOMAIN = 'kvd0hr-0x.myshopify.com';
            `,
          }}
        />""")

with open('src/components/ProductReviews.tsx', 'w') as f:
    f.write(content)
print("Patched to standard script tag")
