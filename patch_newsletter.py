with open('src/app/api/newsletter/route.ts', 'r') as f:
    content = f.read()

resend_logic = """    }

    // 4. Send Welcome Email via Resend (if API key is present)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: 'Mouleeta <hello@mouleeta.shop>',
            to: email,
            subject: 'Welcome to Mouleeta Privé',
            html: `
              <div style="font-family: sans-serif; text-align: center; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
                <h1 style="font-size: 24px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 20px;">Welcome to Mouleeta</h1>
                <p style="font-size: 14px; line-height: 1.6; color: #4a4a4a; margin-bottom: 30px;">
                  Thank you for joining our exclusive journey. You are now on the list to receive early access to new collections, private sales, and conscious fashion insights.
                </p>
                <div style="margin: 40px 0; border-top: 1px solid #eaeaea; border-bottom: 1px solid #eaeaea; padding: 20px 0;">
                  <p style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #888;">Complimentary Global Shipping on all orders</p>
                </div>
                <a href="https://www.mouleeta.shop" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; text-decoration: none; padding: 15px 30px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Discover the Collection</a>
              </div>
            `
          })
        });
      } catch (emailError) {
        console.error('Failed to send Resend welcome email:', emailError);
        // We don't throw here because Shopify subscription succeeded
      }
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully' });"""

content = content.replace("    }\n\n    return NextResponse.json({ success: true, message: 'Subscribed successfully' });", resend_logic)

with open('src/app/api/newsletter/route.ts', 'w') as f:
    f.write(content)
print("Patched Newsletter API")
