export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { isRateLimited, requestAddress } from "@/lib/rate-limit";

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
      cache: "no-store",
    });
    if (!authRes.ok) return null;
    const authData = await authRes.json();
    return typeof authData.token === "string" ? authData.token : null;
  } catch {
    return null;
  }
}

function response(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

function normalizeOrderNumber(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/^#/, "");
  return /^[A-Za-z0-9-]{1,64}$/.test(normalized) ? normalized : null;
}

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return /^[^\s@]+@[A-Za-z0-9.-]+$/.test(normalized) && normalized.length <= 254
    ? normalized
    : null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderNumber = normalizeOrderNumber(body?.orderNumber);
    const email = normalizeEmail(body?.email);

    if (!orderNumber || !email) {
      return response({ error: "Order number and email are required" }, 400);
    }

    const clientAddress = requestAddress(req);
    if (
      await isRateLimited(`track-order:ip:${clientAddress}`, 10, 10 * 60 * 1000) ||
      await isRateLimited(`track-order:identity:${orderNumber}:${email}`, 5, 10 * 60 * 1000)
    ) {
      return response({ error: "Too many tracking attempts. Please try again later." }, 429);
    }

    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    const apiVersion = process.env.SHOPIFY_API_VERSION || "2024-04";

    if (!domain || !adminToken) {
      return response({ error: "Tracking is temporarily unavailable" }, 503);
    }

    const query = `name:${orderNumber} email:${email}`;
    const shopifyUrl = `https://${domain}/admin/api/${apiVersion}/orders.json?query=${encodeURIComponent(query)}&status=any&limit=10`;
    const shopifyRes = await fetch(shopifyUrl, {
      headers: {
        "X-Shopify-Access-Token": adminToken,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!shopifyRes.ok) {
      console.error("Shopify tracking lookup failed with status:", shopifyRes.status);
      return response({ error: "Tracking is temporarily unavailable" }, 502);
    }

    const shopifyData = await shopifyRes.json();
    const orders = Array.isArray(shopifyData.orders) ? shopifyData.orders : [];
    const order = orders.find(
      (candidate: { name?: unknown; email?: unknown }) =>
        typeof candidate.name === "string" &&
        candidate.name.replace(/^#/, "") === orderNumber &&
        typeof candidate.email === "string" &&
        candidate.email.trim().toLowerCase() === email
    );

    if (!order) {
      return response({ error: "Order not found" }, 404);
    }

    const items = Array.isArray(order.line_items)
      ? order.line_items.slice(0, 50).map(
          (item: { name?: string; variant_title?: string; price?: string }) => ({
            title: typeof item.name === "string" ? item.name.slice(0, 200) : "Item",
            size: typeof item.variant_title === "string" ? item.variant_title.slice(0, 100) : "N/A",
            price: Number.isFinite(Number(item.price)) ? Number(item.price) : 0,
            image: "/images/placeholder.jpg",
          })
        )
      : [];

    // Do not expose a full street address from an unauthenticated guest lookup.
    const shippingAddress = order.shipping_address;
    const maskedAddress = shippingAddress
      ? [shippingAddress.city, shippingAddress.province, shippingAddress.zip]
          .filter((part) => typeof part === "string" && part.length > 0)
          .join(", ") || "Address hidden for privacy"
      : "Address hidden for privacy";

    let status = order.fulfillment_status === "fulfilled" ? "in_transit" : "processing";
    let carrier = "Standard Shipping";
    let trackingCode = "Pending";
    let estimatedDelivery = "Processing your order...";

    if (Array.isArray(order.fulfillments) && order.fulfillments.length > 0) {
      const fulfillment = order.fulfillments[0];
      trackingCode = fulfillment.tracking_number || fulfillment.tracking_company || "Pending";
      carrier = fulfillment.tracking_company || carrier;

      if (fulfillment.tracking_number) {
        const srToken = await getShiprocketToken();
        if (srToken) {
          const srRes = await fetch(
            `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${encodeURIComponent(fulfillment.tracking_number)}`,
            { headers: { Authorization: `Bearer ${srToken}` }, cache: "no-store" }
          );
          if (srRes.ok) {
            const srData = await srRes.json();
            const trackInfo = srData?.tracking_data;
            if (trackInfo?.track_status === 7) {
              status = "delivered";
              estimatedDelivery = `Delivered on ${trackInfo.shipment_track?.[0]?.date || "recently"}`;
            } else if (trackInfo?.track_status === 6) {
              status = "in_transit";
              estimatedDelivery = trackInfo.expected_date
                ? `Expected: ${trackInfo.expected_date}`
                : "In Transit";
            }
          }
        }
      }
    }

    return response({
      success: true,
      tracking: {
        orderNumber: order.name,
        date: new Date(order.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        status,
        carrier,
        trackingCode,
        estimatedDelivery,
        items,
        address: maskedAddress,
      },
    });
  } catch (error) {
    console.error("Tracking API error:", error instanceof Error ? error.name : "unknown");
    return response({ error: "Internal server error" }, 500);
  }
}
