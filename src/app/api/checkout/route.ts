import { NextResponse } from 'next/server';
import { createCart, addToCart } from '@/lib/shopify';

export async function POST(req: Request) {
  try {
    const { lines } = await req.json();

    if (!lines || !Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty or invalid' },
        { status: 400 }
      );
    }

    // 1. Create a fresh Shopify cart session on the server
    const newCart = await createCart();
    if (!newCart) {
      return NextResponse.json(
        { error: 'Failed to create Shopify checkout session' },
        { status: 500 }
      );
    }

    // 2. Add items to the Shopify cart
    const cartWithItems = await addToCart(newCart.id, lines);
    if (!cartWithItems) {
      return NextResponse.json(
        { error: 'Failed to add items to Shopify cart' },
        { status: 500 }
      );
    }

    // 3. Format checkout URL with the correct domain
    const checkoutUrlObj = new URL(newCart.checkoutUrl);
    const checkoutDomain =
      process.env.NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN ||
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
      'checkout.mouleeta.shop';

    checkoutUrlObj.hostname = checkoutDomain;

    if (checkoutDomain.includes('myshopify.com')) {
      checkoutUrlObj.searchParams.set('_fd', '0');
    }

    return NextResponse.json({ url: checkoutUrlObj.toString() });
  } catch (error: unknown) {
    console.error('Server Checkout Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown checkout error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
