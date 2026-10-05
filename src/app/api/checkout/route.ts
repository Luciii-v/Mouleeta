export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createCart, addToCart } from '@/lib/shopify';
import { isRateLimited, requestAddress } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionUserId = (session.user as { id?: string }).id || session.user.email || 'unknown';
    if (await isRateLimited(`checkout:user:${sessionUserId}`, 10, 10 * 60 * 1000) || await isRateLimited(`checkout:ip:${requestAddress(req)}`, 20, 10 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many checkout attempts' }, { status: 429 });
    }

    const body = await req.json();
    const lines = body?.lines;

    if (!Array.isArray(lines) || lines.length === 0 || lines.length > 100) {
      return NextResponse.json(
        { error: 'Cart is empty or invalid' },
        { status: 400 }
      );
    }

    const validLines = lines.every((line) =>
      line &&
      typeof line.merchandiseId === 'string' &&
      /^gid:\/\/shopify\/ProductVariant\/\d+$/.test(line.merchandiseId) &&
      Number.isInteger(line.quantity) &&
      line.quantity >= 1 &&
      line.quantity <= 50
    );

    if (!validLines) {
      return NextResponse.json({ error: 'Invalid cart lines' }, { status: 400 });
    }

    // 1. Create a fresh Shopify cart session on the server
    const newCart = await createCart(session.user.email || undefined);
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
    const configuredCheckoutDomain =
      process.env.NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN ||
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
      'checkout.mouleeta.shop';
    const checkoutDomain = configuredCheckoutDomain
      .replace(/^https?:\/\//, '')
      .split('/')[0]
      .toLowerCase();
    const storeDomain = (process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '')
      .replace(/^https?:\/\//, '')
      .split('/')[0]
      .toLowerCase();

    const isAllowedShopifyHost =
      checkoutUrlObj.protocol === 'https:' &&
      (checkoutUrlObj.hostname === checkoutDomain ||
        checkoutUrlObj.hostname === storeDomain ||
        checkoutUrlObj.hostname.endsWith('.myshopify.com'));

    if (!isAllowedShopifyHost || !/^[a-z0-9.-]+$/.test(checkoutDomain)) {
      console.error('Rejected unexpected Shopify checkout host');
      return NextResponse.json({ error: 'Invalid checkout configuration' }, { status: 500 });
    }

    if (checkoutUrlObj.hostname !== checkoutDomain) {
      checkoutUrlObj.hostname = checkoutDomain;
    }

    if (checkoutDomain.includes('myshopify.com')) {
      checkoutUrlObj.searchParams.set('_fd', '0');
    }

    return NextResponse.json(
      { url: checkoutUrlObj.toString() },
      { headers: { 'Cache-Control': 'private, no-store' } }
    );
  } catch (error: unknown) {
    console.error('Server Checkout Error:', error);
    return NextResponse.json({ error: 'Unable to initialize checkout' }, { status: 500 });
  }
}
