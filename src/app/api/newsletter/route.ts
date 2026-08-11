import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
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
        throw new Error('Failed to update existing customer');
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
        throw new Error('Failed to create customer');
      }
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully' });
  } catch (error: unknown) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
