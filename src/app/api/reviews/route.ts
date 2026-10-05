import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { isRateLimited, requestAddress } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

function response(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=60" },
  });
}

function validProductId(value: unknown): value is string {
  return typeof value === "string" && /^\d{1,64}$/.test(value);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!validProductId(productId)) {
      return response({ error: "Invalid productId" }, 400);
    }

    if (!adminDb) {
      return response({ error: "Reviews unavailable" }, 503);
    }

    const snapshot = await adminDb
      .collection("reviews")
      .where("productId", "==", productId)
      .limit(100)
      .get();

    const reviews = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        const createdAt =
          typeof data.createdAt === "string"
            ? data.createdAt
            : data.createdAt?.toDate instanceof Function
              ? data.createdAt.toDate().toISOString()
              : "";

        return {
          id: doc.id,
          authorName: typeof data.authorName === "string" ? data.authorName : "",
          rating: typeof data.rating === "number" ? data.rating : 0,
          reviewText: typeof data.reviewText === "string" ? data.reviewText : "",
          createdAt,
          status: data.status,
        };
      })
      .filter(
        (review) =>
          review.status === "approved" &&
          review.rating >= 1 &&
          review.rating <= 5 &&
          review.reviewText.length > 0
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .map((review) => ({
        id: review.id,
        authorName: review.authorName,
        rating: review.rating,
        reviewText: review.reviewText,
        createdAt: review.createdAt,
      }));

    return response({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error instanceof Error ? error.name : "unknown");
    return response({ error: "Internal Server Error" }, 500);
  }
}

export async function POST(request: Request) {
  try {
    const client = requestAddress(request);
    if (await isRateLimited(`review:ip:${client}`, 5, 15 * 60 * 1000)) {
      return response({ error: "Too many review submissions" }, 429);
    }

    const body = await request.json();
    const productId = body?.productId;
    const rating = body?.rating;
    const reviewText = typeof body?.reviewText === "string" ? body.reviewText.trim() : "";
    const authorName = typeof body?.authorName === "string" ? body.authorName.trim() : "";

    if (
      !validProductId(productId) ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5 ||
      reviewText.length < 1 ||
      reviewText.length > 2000 ||
      authorName.length < 1 ||
      authorName.length > 100
    ) {
      return response({ error: "Invalid review" }, 400);
    }

    if (!adminDb) {
      return response({ error: "Reviews unavailable" }, 503);
    }

    await adminDb.collection("reviews").add({
      productId,
      rating,
      reviewText,
      authorName,
      createdAt: new Date().toISOString(),
      status: "pending",
    });

    // Do not return a pending review to the public client. It must be approved
    // before it becomes visible through GET.
    return response({
      success: true,
      message: "Review submitted for moderation",
    }, 201);
  } catch (error) {
    console.error("Error adding review:", error instanceof Error ? error.name : "unknown");
    return response({ error: "Internal Server Error" }, 500);
  }
}
