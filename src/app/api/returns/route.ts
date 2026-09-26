export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, items, compensationPreference } = body;

    if (!orderId || !items || items.length === 0 || !compensationPreference) {
      return NextResponse.json(
        { error: "Missing required return fields" },
        { status: 400 }
      );
    }

    // AI Agent Triage Simulation
    // In production, this would call Gemini or Antigravity SDK to evaluate the return.
    let triageDecision = "MANUAL_REVIEW";
    let aiReasoning = "Flagged for manual review by default.";

    const allReasons = items.map((i: { reason: string }) => i.reason);
    
    if (allReasons.includes("Quality concern / Defective") || allReasons.includes("Different from description")) {
      triageDecision = "FLAGGED_FOR_REVIEW";
      aiReasoning = "Potential quality/description discrepancy detected. Requires manual inspection and evidence.";
    } else if (allReasons.every((r: string) => r.startsWith("Size issue") || r === "Changed my mind")) {
      triageDecision = "AUTO_APPROVE";
      aiReasoning = "Standard return reason. Auto-approved per policy.";
    }

    // Make a real fetch request to the Shopify Admin GraphQL API
    const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'kvd0hr-0x.myshopify.com';
    const shopifyToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

    if (!shopifyToken) {
      console.error("Missing SHOPIFY_ADMIN_ACCESS_TOKEN");
      return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    const returnLineItems = items.map((i: { lineItemId?: string, reason: string }) => ({
      fulfillmentLineItemId: i.lineItemId,
      quantity: 1,
      returnReason: "UNKNOWN" // Replace with actual reason mapping if needed
    }));

    const graphqlQuery = {
      query: `
        mutation returnCreate($returnInput: ReturnInput!) {
          returnCreate(returnInput: $returnInput) {
            return {
              id
              status
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        returnInput: {
          orderId: orderId,
          returnLineItems: returnLineItems
        }
      }
    };

    const shopifyResponse = await fetch(`https://${shopifyDomain}/admin/api/2024-04/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shopifyToken
      },
      body: JSON.stringify(graphqlQuery)
    });

    const shopifyData = await shopifyResponse.json();

    if (shopifyData.errors || (shopifyData.data?.returnCreate?.userErrors && shopifyData.data.returnCreate.userErrors.length > 0)) {
      console.error("Shopify Return Error:", shopifyData.errors || shopifyData.data.returnCreate.userErrors);
      return NextResponse.json({ error: "Failed to create return in Shopify" }, { status: 500 });
    }

    const returnId = shopifyData.data?.returnCreate?.return?.id || `RET-${Date.now()}`;

    return NextResponse.json({
      success: true,
      message: "Return request processed successfully",
      triageDecision,
      aiReasoning,
      returnId: returnId
    });
  } catch (error) {
    console.error("Error processing return:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
