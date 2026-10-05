export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const allowedReasons = new Set([
  "Size issue — too large",
  "Size issue — too small",
  "Different from description",
  "Quality concern / Defective",
  "Item arrived late",
  "Changed my mind",
]);

const allowedCompensationPreferences = new Set(["REFUND", "REPLACEMENT"]);

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

interface FulfillmentLineItem {
  id: string;
  quantity: number;
  lineItem: { id: string } | null;
}

interface ShopifyOrder {
  id: string;
  email: string | null;
  displayFinancialStatus: string;
  displayFulfillmentStatus: string;
  fulfillments: Array<{
    deliveredAt: string | null;
    fulfillmentLineItems: { edges: Array<{ node: FulfillmentLineItem }> };
  }>;
}

function isShopifyOrderId(value: unknown): value is string {
  return typeof value === "string" && /^gid:\/\/shopify\/Order\/\d+$/.test(value);
}

function isShopifyLineItemId(value: unknown): value is string {
  return typeof value === "string" && /^gid:\/\/shopify\/LineItem\/\d+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionEmail = session?.user?.email?.trim().toLowerCase();

    if (!sessionEmail) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const body = await request.json();
    const orderId = body?.orderId;
    const items = body?.items;
    const compensationPreference = body?.compensationPreference;

    if (
      !isShopifyOrderId(orderId) ||
      !Array.isArray(items) ||
      items.length === 0 ||
      items.length > 20 ||
      typeof compensationPreference !== "string" ||
      !allowedCompensationPreferences.has(compensationPreference)
    ) {
      return jsonResponse({ error: "Invalid return request" }, 400);
    }

    const requestedItems = items.map((item: unknown) => {
      const candidate = item as { itemId?: unknown; reason?: unknown };
      return {
        itemId: candidate.itemId,
        reason: candidate.reason,
      };
    });

    if (
      requestedItems.some(
        (item) =>
          !isShopifyLineItemId(item.itemId) ||
          typeof item.reason !== "string" ||
          !allowedReasons.has(item.reason)
      ) ||
      new Set(requestedItems.map((item) => item.itemId)).size !== requestedItems.length
    ) {
      return jsonResponse({ error: "Invalid return items" }, 400);
    }

    const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const shopifyToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    const apiVersion = process.env.SHOPIFY_API_VERSION || "2024-04";

    if (!shopifyDomain || !shopifyToken) {
      console.error("Missing Shopify Admin configuration for returns");
      return jsonResponse({ error: "Service unavailable" }, 503);
    }

    const orderQuery = `
      query GetReturnOrder($id: ID!) {
        order(id: $id) {
          id
          email
          displayFinancialStatus
          displayFulfillmentStatus
          fulfillments(first: 20) {
            deliveredAt
            fulfillmentLineItems(first: 100) {
              edges {
                node {
                  id
                  quantity
                  lineItem { id }
                }
              }
            }
          }
        }
      }
    `;

    const orderResponse = await fetch(
      `https://${shopifyDomain}/admin/api/${apiVersion}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": shopifyToken,
        },
        body: JSON.stringify({ query: orderQuery, variables: { id: orderId } }),
        cache: "no-store",
      }
    );

    if (!orderResponse.ok) {
      console.error("Shopify order ownership lookup failed with status:", orderResponse.status);
      return jsonResponse({ error: "Unable to validate return request" }, 502);
    }

    const orderPayload = await orderResponse.json();
    const order = orderPayload.data?.order as ShopifyOrder | null | undefined;

    if (
      !order ||
      !order.email ||
      order.email.trim().toLowerCase() !== sessionEmail ||
      order.displayFinancialStatus !== "PAID" ||
      order.displayFulfillmentStatus !== "FULFILLED"
    ) {
      return jsonResponse({ error: "Return request unavailable" }, 404);
    }

    const deliveredAt = order.fulfillments
      .map((fulfillment) => fulfillment.deliveredAt)
      .filter((date): date is string => Boolean(date))
      .map((date) => new Date(date))
      .filter((date) => !Number.isNaN(date.getTime()))
      .sort((a, b) => b.getTime() - a.getTime())[0];

    if (!deliveredAt) {
      return jsonResponse({ error: "Return request unavailable" }, 400);
    }

    const ageInDays = (Date.now() - deliveredAt.getTime()) / (24 * 60 * 60 * 1000);
    if (ageInDays < 0 || ageInDays > 14) {
      return jsonResponse({ error: "The return window has closed" }, 400);
    }

    const fulfillmentItems = new Map<string, FulfillmentLineItem>();
    for (const fulfillment of order.fulfillments) {
      for (const edge of fulfillment.fulfillmentLineItems.edges) {
        const lineItemId = edge.node.lineItem?.id;
        if (lineItemId) fulfillmentItems.set(lineItemId, edge.node);
      }
    }

    const returnLineItems = requestedItems.map((item) => {
      const fulfillmentItem = fulfillmentItems.get(item.itemId as string);
      return {
        fulfillmentLineItemId: fulfillmentItem?.id,
        quantity: 1,
      };
    });

    if (
      returnLineItems.some(
        (item, index) =>
          !item.fulfillmentLineItemId ||
          item.quantity > (fulfillmentItems.get(requestedItems[index].itemId as string)?.quantity || 0)
      )
    ) {
      return jsonResponse({ error: "Invalid return items" }, 400);
    }

    const returnQuery = `
      mutation CreateReturn($returnInput: ReturnInput!) {
        returnCreate(returnInput: $returnInput) {
          return { id status }
          userErrors { field message }
        }
      }
    `;

    const returnResponse = await fetch(
      `https://${shopifyDomain}/admin/api/${apiVersion}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": shopifyToken,
        },
        body: JSON.stringify({
          query: returnQuery,
          variables: {
            returnInput: {
              orderId,
              returnLineItems,
            },
          },
        }),
        cache: "no-store",
      }
    );

    if (!returnResponse.ok) {
      console.error("Shopify return creation failed with status:", returnResponse.status);
      return jsonResponse({ error: "Failed to create return" }, 502);
    }

    const returnPayload = await returnResponse.json();
    const userErrors = returnPayload.data?.returnCreate?.userErrors || [];
    if (returnPayload.errors || userErrors.length > 0) {
      console.error("Shopify return creation returned validation errors");
      return jsonResponse({ error: "Failed to create return" }, 400);
    }

    const returnId = returnPayload.data?.returnCreate?.return?.id;
    if (typeof returnId !== "string") {
      return jsonResponse({ error: "Failed to create return" }, 502);
    }

    return jsonResponse({
      success: true,
      message: "Return request submitted for review",
      triageDecision: "MANUAL_REVIEW",
      returnId,
    });
  } catch (error) {
    console.error("Error processing return request:", error instanceof Error ? error.name : "unknown");
    return jsonResponse({ error: "Internal Server Error" }, 500);
  }
}
