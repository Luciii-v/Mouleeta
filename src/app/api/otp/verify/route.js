export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import {
  consumeOtp,
  normalizeEmail,
} from "@/lib/otp";
import { isRateLimited, requestAddress } from "@/lib/rate-limit";

export async function POST(req) {
  try {
    const body = await req.json();
    const target = normalizeEmail(body?.target);
    const otp = typeof body?.otp === "string" ? body.otp.trim() : "";

    if (!target || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, error: "Missing target or verification code." },
        { status: 400 }
      );
    }

    if (await isRateLimited(`otp-verify:ip:${requestAddress(req)}`, 30, 10 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: "Too many verification attempts." },
        { status: 429, headers: { "Cache-Control": "no-store" } }
      );
    }

    // Profile verification and sign-in challenges are purpose-separated.
    // This endpoint cannot consume an authentication OTP or issue a session.
    const result = await consumeOtp(target, otp, "profile-email");

    if (!result.ok) {
      const status = result.reason === "expired" ? 410 : result.reason === "attempts" ? 429 : 400;
      return NextResponse.json(
        { success: false, error: "Invalid or expired verification code." },
        { status, headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: "Identity verified successfully.",
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("OTP verification unavailable");
    return NextResponse.json(
      { success: false, error: "Internal verification error. Please try again." },
      { status: error instanceof SyntaxError ? 400 : 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
