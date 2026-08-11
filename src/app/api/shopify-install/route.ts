import { NextResponse } from "next/server";

export async function GET() {
  // 1. Get Client ID from env
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "kvd0hr-0x.myshopify.com";
  
  if (!clientId) {
    return NextResponse.json({ error: "Missing SHOPIFY_CLIENT_ID in .env.local" });
  }

  // 2. Build the authorization URL
  const scopes = "read_orders,read_customers";
  const redirectUri = "http://localhost:3000/api/shopify-install/callback";
  
  const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;
  
  // 3. Redirect the user to Shopify to approve the installation
  return NextResponse.redirect(authUrl);
}
