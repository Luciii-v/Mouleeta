import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const shop = searchParams.get("shop");
  
  if (!code || !shop) {
    return NextResponse.json({ error: "Missing code or shop parameter" }, { status: 400 });
  }

  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "Missing Client ID or Secret in .env.local" }, { status: 500 });
  }

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      const errData = await tokenResponse.text();
      return NextResponse.json({ error: "Failed to get access token", details: errData }, { status: 500 });
    }

    const data = await tokenResponse.json();
    const accessToken = data.access_token; // This is the shpat_... token!

    // Return a beautiful HTML page that gives them the token
    const html = `
      <html>
        <head>
          <title>Installation Successful!</title>
          <style>
            body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f9f9f9; color: #333; text-align: center; }
            .card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 600px; }
            .token { background: #1A1A1A; color: #00FF00; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 16px; margin: 20px 0; word-break: break-all; }
            h1 { color: #10B981; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>🎉 Success!</h1>
            <p>Your Shopify Admin API Token has been generated. This token is permanent.</p>
            <p><strong>Copy this token and paste it to the AI chat:</strong></p>
            <div class="token">${accessToken}</div>
            <p>You can close this tab now.</p>
          </div>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Exception occurred", message: error.message }, { status: 500 });
  }
}
