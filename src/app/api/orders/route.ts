import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    const apiVersion = process.env.SHOPIFY_API_VERSION || "2024-04";

    if (!domain || !adminToken) {
      console.error("Missing Shopify Admin configuration");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    const query = `
      query getCustomerOrders($query: String!) {
        orders(first: 20, query: $query, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              id
              name
              createdAt
              displayFulfillmentStatus
              displayFinancialStatus
              totalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              fulfillments(first: 10) {
                trackingInfo {
                  number
                  company
                }
                deliveredAt
              }
              lineItems(first: 50) {
                edges {
                  node {
                    id
                    title
                    variantTitle
                    quantity
                    originalTotalSet {
                      shopMoney {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      query: `email:${email}`
    };

    const res = await fetch(`https://${domain}/admin/api/${apiVersion}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Shopify Admin API Error:", errorText);
      return NextResponse.json({ error: "Failed to fetch orders from Shopify" }, { status: 500 });
    }

    const json = await res.json();
    if (json.errors) {
      console.error("Shopify GraphQL Errors:", json.errors);
      return NextResponse.json({ error: "GraphQL Error" }, { status: 500 });
    }

    const ordersData = json.data?.orders?.edges || [];

    // Map to the format expected by the frontend
    const formattedOrders = ordersData.map(({ node }: any) => {
      // Find the first fulfillment that has tracking info, if any
      const fulfillments = node.fulfillments || [];
      let trackingNumber = null;
      let deliveryDate = null;
      let isDelivered = false;

      if (fulfillments.length > 0) {
        const f = fulfillments[0];
        if (f.trackingInfo && f.trackingInfo.length > 0) {
          trackingNumber = f.trackingInfo[0].number;
        }
        if (f.deliveredAt) {
          deliveryDate = f.deliveredAt;
          isDelivered = true;
        }
      }

      // Format currency
      const formatCurrency = (amount: string, currency: string) => {
        return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(parseFloat(amount));
      };

      const dateObj = new Date(node.createdAt);
      const formattedDate = dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

      let statusLabel = node.displayFulfillmentStatus || "PROCESSING";
      if (statusLabel === "FULFILLED") {
        statusLabel = isDelivered ? "Delivered" : "Shipped";
      } else {
        statusLabel = "Processing";
      }

      const items = (node.lineItems?.edges || []).map(({ node: itemNode }: any) => ({
        id: itemNode.id,
        title: itemNode.title,
        variant: itemNode.variantTitle || "Default Title",
        quantity: itemNode.quantity,
        price: formatCurrency(itemNode.originalTotalSet?.shopMoney?.amount || "0", itemNode.originalTotalSet?.shopMoney?.currencyCode || "INR")
      }));

      return {
        id: node.id,
        orderNumber: node.name,
        date: formattedDate,
        total: formatCurrency(node.totalPriceSet.shopMoney.amount, node.totalPriceSet.shopMoney.currencyCode),
        fulfillmentStatus: node.displayFulfillmentStatus,
        paymentStatus: node.displayFinancialStatus,
        deliveryDate,
        statusLabel,
        itemsCount: items.length,
        trackingNumber,
        items
      };
    });

    return NextResponse.json(formattedOrders);
  } catch (error: any) {
    console.error("Error in /api/orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
