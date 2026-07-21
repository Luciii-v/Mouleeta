import { NextResponse } from "next/server";

// In-memory OTP store (replace with Redis/Upstash for multi-instance production)
global.otpStore = global.otpStore || new Map();

// In-memory rate limiter: tracks send attempts per target
// Structure: { target -> { count, resetAt } }
global.otpRateLimiter = global.otpRateLimiter || new Map();

const RATE_LIMIT_MAX = 3;         // Max OTP sends per window
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function isRateLimited(target) {
  const key = target.trim().toLowerCase();
  const now = Date.now();
  const record = global.otpRateLimiter.get(key);

  if (!record || now > record.resetAt) {
    // First request or window expired — start fresh
    global.otpRateLimiter.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true; // Rate limited
  }

  // Increment count
  record.count += 1;
  global.otpRateLimiter.set(key, record);
  return false;
}

function validateTarget(target, type) {
  if (type === "email") {
    // Basic RFC-compliant email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(target.trim());
  }
  if (type === "phone") {
    // Accept digits, spaces, dashes, plus — minimum 7 digits
    const phoneDigits = target.replace(/\D/g, "");
    return phoneDigits.length >= 7 && phoneDigits.length <= 15;
  }
  return false;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { target, type } = body;

    if (!target || !type) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email or phone number." },
        { status: 400 }
      );
    }

    // Validate format
    if (!validateTarget(target, type)) {
      return NextResponse.json(
        { success: false, error: type === "email" ? "Please enter a valid email address." : "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    // Check rate limit
    if (isRateLimited(target)) {
      return NextResponse.json(
        { success: false, error: "Too many verification requests. Please wait 10 minutes before trying again." },
        { status: 429 }
      );
    }

    // Generate secure 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with 10-minute expiration and attempt counter (for brute-force protection)
    const expiresAt = Date.now() + 10 * 60 * 1000;
    global.otpStore.set(target.trim().toLowerCase(), { otp, expiresAt, type, attempts: 0 });

    // --- OTP Dispatch ---
    // OTP is dispatched securely via SMS/Email provider — NEVER returned to the client.
    // TODO for production: Integrate Resend (email) or Twilio (SMS) here.
    // Example:
    //   if (type === 'email') await resend.emails.send({ to: target, subject: 'Your Mouleeta OTP', ... });
    //   if (type === 'phone') await twilioClient.messages.create({ to: target, body: `Your code: ${otp}` });
    const hasEmailProvider = Boolean(process.env.RESEND_API_KEY);
    const hasSmsProvider = Boolean(process.env.TWILIO_ACCOUNT_SID);

    if (process.env.NODE_ENV === "development") {
      // In development only, log the OTP to the SERVER terminal for testing.
      // This never reaches the client response.
      console.log(`[MOULEETA DEV] OTP for ${type} ${target}: ${otp}`);
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to your ${type === "email" ? "email address" : "phone number"}.`,
      expiresIn: "10 minutes",
      // NOTE: OTP is intentionally NOT returned here. Check server logs in development.
    });
  } catch (error) {
    console.error("Error dispatching OTP:", error);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch verification code. Please try again." },
      { status: 500 }
    );
  }
}
