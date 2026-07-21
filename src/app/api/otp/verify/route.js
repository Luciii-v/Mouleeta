import { NextResponse } from "next/server";

// Shared in-memory OTP store (must match the send route's global store)
global.otpStore = global.otpStore || new Map();

const MAX_ATTEMPTS = 5; // Invalidate OTP after this many failed attempts

export async function POST(req) {
  try {
    const body = await req.json();
    const { target, otp } = body;

    if (!target || !otp) {
      return NextResponse.json(
        { success: false, error: "Missing target or verification code." },
        { status: 400 }
      );
    }

    const key = target.trim().toLowerCase();
    const record = global.otpStore.get(key);

    // If no record exists (expired, already used, or never sent)
    if (!record) {
      return NextResponse.json(
        { success: false, error: "Verification code not found or has already been used. Please request a new code." },
        { status: 404 }
      );
    }

    // Check expiry FIRST — even a correct code should not work if expired
    if (record.expiresAt < Date.now()) {
      global.otpStore.delete(key);
      return NextResponse.json(
        { success: false, error: "Verification code has expired. Please request a new code." },
        { status: 410 }
      );
    }

    // Check brute-force attempt limit
    const attempts = record.attempts ?? 0;
    if (attempts >= MAX_ATTEMPTS) {
      global.otpStore.delete(key);
      return NextResponse.json(
        { success: false, error: "Too many incorrect attempts. This code has been invalidated. Please request a new one." },
        { status: 429 }
      );
    }

    // Compare the provided OTP against the stored one (trimmed, string comparison)
    if (record.otp !== otp.trim()) {
      // Increment attempt counter
      global.otpStore.set(key, { ...record, attempts: attempts + 1 });
      const remaining = MAX_ATTEMPTS - (attempts + 1);
      return NextResponse.json(
        {
          success: false,
          error: `Invalid verification code. ${remaining > 0 ? `${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.` : "This code has been invalidated."}`,
        },
        { status: 400 }
      );
    }

    // ✅ Correct OTP — consume it immediately (one-time use)
    global.otpStore.delete(key);

    return NextResponse.json({
      success: true,
      verified: true,
      message: "Identity verified successfully.",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { success: false, error: "Internal verification error. Please try again." },
      { status: 500 }
    );
  }
}
