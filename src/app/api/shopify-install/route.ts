export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";

export async function GET() {
  // This was a temporary setup utility that could expose Admin credentials.
  // Keep it disabled until a complete, authenticated OAuth installation flow
  // with durable token storage is deliberately configured.
  return NextResponse.json({ error: "Shopify installation is disabled" }, { status: 404 });
}
