export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { isRateLimited, requestAddress } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    if (await isRateLimited(`newsletter:ip:${requestAddress(req)}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json();
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || email.length > 254 || !/^[^\s@]+@[A-Za-z0-9.-]+$/.test(email)) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-04';

    if (!domain || !adminToken) {
      return NextResponse.json({ error: 'Shopify configuration missing' }, { status: 500 });
    }

    // 1. Search if customer already exists
    const searchRes = await fetch(
      `https://${domain}/admin/api/${apiVersion}/customers/search.json?query=email:${encodeURIComponent(email)}`,
      {
        headers: {
          'X-Shopify-Access-Token': adminToken,
          'Content-Type': 'application/json',
        },
      }
    );

    const searchData = await searchRes.json();
    const existingCustomer = searchData.customers && searchData.customers.length > 0 ? searchData.customers[0] : null;

    if (existingCustomer) {
      // 2. Update existing customer to accept marketing
      const updateRes = await fetch(
        `https://${domain}/admin/api/${apiVersion}/customers/${existingCustomer.id}.json`,
        {
          method: 'PUT',
          headers: {
            'X-Shopify-Access-Token': adminToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customer: {
              id: existingCustomer.id,
              accepts_marketing: true,
            },
          }),
        }
      );

      if (!updateRes.ok) {
        const errorData = await updateRes.json().catch(() => ({}));
        console.error('Failed to update customer with status:', updateRes.status);
        throw new Error(errorData.errors ? JSON.stringify(errorData.errors) : 'Failed to update existing customer');
      }
    } else {
      // 3. Create new customer who accepts marketing
      const createRes = await fetch(
        `https://${domain}/admin/api/${apiVersion}/customers.json`,
        {
          method: 'POST',
          headers: {
            'X-Shopify-Access-Token': adminToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customer: {
              email,
              accepts_marketing: true,
            },
          }),
        }
      );

      if (!createRes.ok) {
        const errorData = await createRes.json().catch(() => ({}));
        console.error('Failed to create customer with status:', createRes.status);
        // If email is taken but wasn't found in search (eventual consistency), handle it gracefully
        if (errorData.errors?.email?.includes('has already been taken')) {
          return NextResponse.json({ success: true, message: 'Already subscribed' });
        }
        throw new Error(errorData.errors ? JSON.stringify(errorData.errors) : 'Failed to create customer');
      }
    }

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

    return NextResponse.json(
      { success: true, message: 'Subscribed successfully' },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error: unknown) {
    console.error('Newsletter subscription error:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
