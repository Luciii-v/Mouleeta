import { NextResponse } from 'next/server';

async function getShiprocketToken() {
  if (process.env.SHIPROCKET_API_TOKEN) {
    return process.env.SHIPROCKET_API_TOKEN;
  }
  const email = process.env.SHIPROCKET_API_EMAIL;
  const password = process.env.SHIPROCKET_API_PASSWORD;
  if (!email || !password) return null;
  try {
    const authRes = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!authRes.ok) return null;
    const authData = await authRes.json();
    return authData.token || null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { orderNumber, email } = await req.json();
    if (!orderNumber || !email) {
      return NextResponse.json({ error: 'Order number and email are required' }, { status: 400 });
    }

    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-04';

    if (!domain || !adminToken) {
      return NextResponse.json({ error: 'Shopify config missing' }, { status: 500 });
    }

    // 1. Fetch order from Shopify
    // Shopify order name usually has # (e.g., #1001), but users might not include it. We will try both if needed.
    const cleanOrderNumber = orderNumber.trim();
    const query = `name:${cleanOrderNumber} email:${email}`;
    const shopifyUrl = `https://${domain}/admin/api/${apiVersion}/orders.json?query=${encodeURIComponent(query)}&status=any`;
    
    const shopifyRes = await fetch(shopifyUrl, {
      headers: { 'X-Shopify-Access-Token': adminToken, 'Content-Type': 'application/json' }
    });

    if (!shopifyRes.ok) {
      return NextResponse.json({ error: 'Failed to connect to Shopify' }, { status: 500 });
    }

    const shopifyData = await shopifyRes.json();
    const orders = shopifyData.orders;
    if (!orders || orders.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orders[0];
    
    // Extract Items
    const items = order.line_items.map((item: { name: string; variant_title?: string; price: string }) => {
      // In Shopify admin API, line items don't typically include images directly unless expanded,
      // but we will do our best or fallback.
      return {
        title: item.name,
        size: item.variant_title || 'N/A',
        price: parseFloat(item.price),
        image: '/images/placeholder.jpg' // Defaulting to placeholder for now
      };
    });

    const address = order.shipping_address 
      ? `${order.shipping_address.address1}, ${order.shipping_address.city}, ${order.shipping_address.zip}`
      : 'Address not available';

    // 2. Fetch Tracking Data from Shiprocket (if fulfilled)
    let status = order.fulfillment_status === 'fulfilled' ? 'in_transit' : 'processing';
    let carrier = 'Standard Shipping';
    let trackingCode = 'Pending';
    let estimatedDelivery = 'Processing your order...';

    if (order.fulfillments && order.fulfillments.length > 0) {
      const fulfillment = order.fulfillments[0];
      trackingCode = fulfillment.tracking_number || fulfillment.tracking_company || 'Pending';
      carrier = fulfillment.tracking_company || carrier;
      
      // If we have an actual tracking number, call Shiprocket
      if (fulfillment.tracking_number) {
        const srToken = await getShiprocketToken();
        if (srToken) {
          const srRes = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${fulfillment.tracking_number}`, {
            headers: { 'Authorization': `Bearer ${srToken}` }
          });
          if (srRes.ok) {
            const srData = await srRes.json();
            const trackInfo = srData?.tracking_data;
            if (trackInfo && trackInfo.track_status) {
              const statusCode = trackInfo.track_status;
              if (statusCode === 7) {
                status = 'delivered';
                estimatedDelivery = `Delivered on ${trackInfo.shipment_track?.[0]?.date || 'recently'}`;
              } else if (statusCode === 6) {
                status = 'in_transit';
                estimatedDelivery = trackInfo.expected_date ? `Expected: ${trackInfo.expected_date}` : 'In Transit';
              }
            }
          }
        }
      }
    }

    const result = {
      orderNumber: order.name,
      date: new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      status,
      carrier,
      trackingCode,
      estimatedDelivery,
      items,
      address
    };

    return NextResponse.json({ success: true, tracking: result });
  } catch (error) {
    console.error('Tracking API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
