export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { isRateLimited, requestAddress } from "@/lib/rate-limit";

async function getShiprocketToken() {
  if (process.env.SHIPROCKET_API_TOKEN) return process.env.SHIPROCKET_API_TOKEN;

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
    const data = await authRes.json();
    return typeof data.token === "string" ? data.token : null;
  } catch {
    return null;
  }
}

function response(body, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

function validOrderId(value) {
  return typeof value === "string" && /^gid:\/\/shopify\/Order\/\d+$/.test(value);
}

function validAwb(value) {
  return typeof value === "string" && /^[A-Za-z0-9-]{3,80}$/.test(value);
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email?.trim().toLowerCase();
    const { searchParams } = new URL(request.url);
    const awb = searchParams.get("awb");
    const orderId = searchParams.get("orderId");

    if (!email || !validAwb(awb) || !validOrderId(orderId)) {
      return response({ error: "Unauthorized" }, 401);
    }

    const client = requestAddress(request);
    if (await isRateLimited(`track:ip:${client}`, 30, 10 * 60 * 1000)) {
      return response({ error: "Too many tracking attempts" }, 429);
    }

    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    const apiVersion = process.env.SHOPIFY_API_VERSION || "2024-04";
    if (!domain || !adminToken) return response({ error: "Tracking unavailable" }, 503);

    const ownershipQuery = `
      query VerifyTrackingOrder($id: ID!) {
        order(id: $id) {
          email
          fulfillments(first: 20) {
            trackingInfo { number company }
          }
        }
      }
    `;
    const ownershipResponse = await fetch(
      `https://${domain}/admin/api/${apiVersion}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": adminToken,
        },
        body: JSON.stringify({ query: ownershipQuery, variables: { id: orderId } }),
        cache: "no-store",
      }
    );

    if (!ownershipResponse.ok) return response({ error: "Tracking unavailable" }, 502);
    const ownershipPayload = await ownershipResponse.json();
    const order = ownershipPayload.data?.order;
    const hasMatchingTracking = order?.fulfillments?.some((fulfillment) =>
      fulfillment.trackingInfo?.some((tracking) => tracking.number === awb)
    );

    if (
      !order ||
      typeof order.email !== "string" ||
      order.email.trim().toLowerCase() !== email ||
      !hasMatchingTracking
    ) {
      return response({ error: "Tracking unavailable" }, 404);
    }

    const token = await getShiprocketToken();
    if (!token) return response({ error: "Tracking provider unavailable" }, 503);

    const shiprocketResponse = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${encodeURIComponent(awb)}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!shiprocketResponse.ok) return response({ error: "Tracking unavailable" }, 502);

    const data = await shiprocketResponse.json();
    const trackInfo = data?.tracking_data || {};
    const statusCode = trackInfo.track_status;
    const statusText = typeof trackInfo.shipment_status === "string"
      ? trackInfo.shipment_status.toUpperCase()
      : "";

    let currentStatus = 1;
    if (statusCode === 7 || statusText.includes("DELIVERED")) currentStatus = 5;
    else if (
      statusCode === 6 ||
      statusText.includes("IN TRANSIT") ||
      statusText.includes("SHIPPED") ||
      statusText.includes("OUT FOR DELIVERY") ||
      statusText.includes("DISPATCHED")
    ) currentStatus = 4;
    else if (statusCode === 18 || statusText.includes("PICKUP") || statusText.includes("WAITING")) currentStatus = 3;
    else if (statusCode === 17 || statusText.includes("PACKED") || statusText.includes("READY")) currentStatus = 2;

    const shipmentTrack = Array.isArray(trackInfo.shipment_track)
      ? trackInfo.shipment_track.slice(0, 50).map((scan) => ({
          current_status: typeof scan.current_status === "string" ? scan.current_status.slice(0, 100) : "",
          location: typeof scan.location === "string" ? scan.location.slice(0, 200) : "",
          date: typeof scan.date === "string" ? scan.date.slice(0, 80) : "",
        }))
      : [];

    return response({
      statusId: currentStatus,
      // Preserve the UI shape while returning only an explicit allowlist of
      // shipment fields. Never forward the raw provider response.
      trackingData: {
        tracking_data: {
          carrier: typeof trackInfo.carrier === "string" ? trackInfo.carrier.slice(0, 100) : "",
          expected_date: typeof trackInfo.expected_date === "string" ? trackInfo.expected_date.slice(0, 80) : "",
          shipment_track: shipmentTrack,
        },
      },
      isSimulation: false,
    });
  } catch (error) {
    console.error("Shiprocket tracking error:", error instanceof Error ? error.name : "unknown");
    return response({ error: "Failed to fetch tracking data" }, 500);
  }
}
