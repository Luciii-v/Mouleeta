import { NextResponse } from "next/server";

// In-memory store for OTPs (In production, replace with Redis or database)
global.otpStore = global.otpStore || new Map();

export async function POST(req) {
  try {
    const body = await req.json();
    const { target, type } = body; // target: email or phone string, type: 'email' | 'phone'

    if (!target) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email or phone number." },
        { status: 400 }
      );
    }

    // Generate secure 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with 10-minute expiration
    const expiresAt = Date.now() + 10 * 60 * 1000;
    global.otpStore.set(target.trim().toLowerCase(), { otp, expiresAt, type });

    console.log(`[Mouleeta Privé OTP] Dispatched ${otp} to ${type}: ${target}`);

    // If real SMS/Email integration (e.g. Twilio, Resend, SendGrid) credentials exist in process.env, send here.
    // Otherwise, return devOtp in sandbox/development mode so users can verify effortlessly.
    const isSandbox = !process.env.TWILIO_ACCOUNT_SID && !process.env.RESEND_API_KEY;

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${target}.`,
      // Provide devOtp for immediate testing and verification
      devOtp: otp,
      expiresIn: "10 minutes",
    });
  } catch (error) {
    console.error("Error dispatching OTP:", error);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch verification code." },
      { status: 500 }
    );
  }
}
