export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { adminDb } from "@/lib/firebase-admin";
import type { DocumentData } from "firebase-admin/firestore";

const allowedGenders = new Set(["Select", "Female", "Male", "Non-binary", "Other"]);

function toPublicProfile(data: DocumentData | undefined) {
  return {
    name: typeof data?.name === "string" ? data.name : "",
    email: typeof data?.email === "string" ? data.email : "",
    phoneNumber: typeof data?.phoneNumber === "string" ? data.phoneNumber : null,
    phoneVerified: data?.phoneVerified === true,
    gender: typeof data?.gender === "string" ? data.gender : null,
    marketingOptIn: data?.marketingOptIn === true,
    createdAt: typeof data?.createdAt === "string" ? data.createdAt : undefined,
    updatedAt: typeof data?.updatedAt === "string" ? data.updatedAt : undefined,
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    // @ts-expect-error missing type
    const uid = session?.user?.id;

    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const ref = adminDb.collection("users").doc(uid);
    const snap = await ref.get();

    if (snap.exists) {
      return NextResponse.json(toPublicProfile(snap.data()), {
        headers: { "Cache-Control": "private, no-store" },
      });
    } else {
      // First login ever — seed a doc
      const seed = {
        name: session?.user?.name ?? "",
        email: session?.user?.email ?? "",
        phoneNumber: null,
        phoneVerified: false,
        gender: null,
        marketingOptIn: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await ref.set(seed);
      return NextResponse.json(seed, {
        headers: { "Cache-Control": "private, no-store" },
      });
    }
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-expect-error missing type
    const uid = session?.user?.id;

    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Whitelist and validate client-editable fields. Verification state is
    // server-owned and can never be set by a profile request.
    const allowedUpdates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (body.name !== undefined) {
      if (typeof body.name !== "string" || body.name.trim().length > 120) {
        return NextResponse.json({ error: "Invalid name" }, { status: 400 });
      }
      allowedUpdates.name = body.name.trim();
    }

    if (body.gender !== undefined) {
      if (typeof body.gender !== "string" || !allowedGenders.has(body.gender)) {
        return NextResponse.json({ error: "Invalid gender" }, { status: 400 });
      }
      allowedUpdates.gender = body.gender;
    }

    if (body.marketingOptIn !== undefined) {
      if (typeof body.marketingOptIn !== "boolean") {
        return NextResponse.json({ error: "Invalid marketing preference" }, { status: 400 });
      }
      allowedUpdates.marketingOptIn = body.marketingOptIn;
    }

    if (body.phoneNumber !== undefined) {
      if (
        body.phoneNumber !== null &&
        (typeof body.phoneNumber !== "string" || body.phoneNumber.length > 32 || !/^\+?[0-9 ()-]+$/.test(body.phoneNumber))
      ) {
        return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
      }
      allowedUpdates.phoneNumber = body.phoneNumber === null ? null : body.phoneNumber.trim();
      // A changed phone number is never considered verified automatically.
      allowedUpdates.phoneVerified = false;
    }

    const ref = adminDb.collection("users").doc(uid);
    await ref.set(allowedUpdates, { merge: true });

    return NextResponse.json(
      { success: true, data: { ...allowedUpdates, phoneVerified: allowedUpdates.phoneVerified ?? undefined } },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("Profile POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
