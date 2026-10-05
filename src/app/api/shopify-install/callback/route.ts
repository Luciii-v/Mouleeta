export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  void request;
  // This callback intentionally does not perform an OAuth exchange. The old
  // implementation forwarded the client secret to an attacker-controlled
  // `shop` host and rendered the Admin token into HTML.
  return NextResponse.json({ error: "Shopify installation is disabled" }, { status: 404 });
}
