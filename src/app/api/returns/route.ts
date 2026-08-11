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

    // TODO: Actually save this return request to the database or Shopify via GraphQL Admin API
    // e.g., create a Return in Shopify Admin API

    return NextResponse.json({
      success: true,
      message: "Return request processed successfully",
      triageDecision,
      aiReasoning,
      returnId: `RET-${Date.now()}`
    });
  } catch (error) {
    console.error("Error processing return:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
