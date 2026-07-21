import { NextResponse } from "next/server";

// ─── In-memory stores (replace with Redis/Upstash for multi-instance production) ───
global.otpStore = global.otpStore || new Map();
global.otpRateLimiter = global.otpRateLimiter || new Map();

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function isRateLimited(target) {
  const key = target.trim().toLowerCase();
  const now = Date.now();
  const record = global.otpRateLimiter.get(key);
  if (!record || now > record.resetAt) {
    global.otpRateLimiter.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (record.count >= RATE_LIMIT_MAX) return true;
  record.count += 1;
  global.otpRateLimiter.set(key, record);
  return false;
}

function validateTarget(target, type) {
  if (type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target.trim());
  if (type === "phone") {
    const digits = target.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  }
  return false;
}

// ─── Email dispatch via Resend (free tier — https://resend.com) ───────────────
async function sendEmailOtp(to, otp) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "no_provider" };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Mouleeta Privé <noreply@mouleeta.shop>",
        to: [to],
        subject: `${otp} — Your Mouleeta Verification Code`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #FAFAF8;">
            <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #999; margin-bottom: 32px;">MOULEETA PRIVÉ</p>
            <h2 style="font-weight: 300; font-size: 24px; letter-spacing: 0.05em; color: #1A1A1A; margin-bottom: 8px;">Verification Code</h2>
            <p style="font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 32px;">
              Use the code below to securely verify your identity. It expires in <strong>10 minutes</strong>.
            </p>
            <div style="background: #1A1A1A; color: #FAFAF8; text-align: center; padding: 24px; letter-spacing: 0.5em; font-size: 32px; font-weight: 400; font-family: monospace; margin-bottom: 32px;">
              ${otp}
            </div>
            <p style="font-size: 12px; color: #999; line-height: 1.6;">
              If you did not request this code, please ignore this email. Do not share this code with anyone.
            </p>
            <hr style="border: none; border-top: 1px solid #E8E8E4; margin: 32px 0;" />
            <p style="font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #BBB;">
              MOULEETA — Crafted Consciously
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[Resend] Email send failed:", err);
      return { sent: false, reason: "provider_error", detail: err?.message };
    }
    return { sent: true };
  } catch (err) {
    console.error("[Resend] Network error:", err);
    return { sent: false, reason: "network_error" };
  }
}

// ─── SMS dispatch via Fast2SMS (India) or Twilio ─────────────────────────────
async function sendSmsOtp(phone, otp) {
  // — Fast2SMS (India, free tier) —
  if (process.env.FAST2SMS_API_KEY) {
    const digits = phone.replace(/\D/g, "").slice(-10); // last 10 digits
    try {
      const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variables_values: otp,
          route: "otp",
          numbers: digits,
        }),
      });
      const data = await res.json();
      if (data.return === true) return { sent: true };
      console.error("[Fast2SMS] Failed:", data);
      return { sent: false, reason: "provider_error" };
    } catch (err) {
      console.error("[Fast2SMS] Network error:", err);
      return { sent: false, reason: "network_error" };
    }
  }

  // — Twilio fallback —
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    try {
      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            From: process.env.TWILIO_PHONE_NUMBER,
            To: phone,
            Body: `Your Mouleeta verification code is: ${otp}. Valid for 10 minutes. Do not share.`,
          }),
        }
      );
      if (res.ok) return { sent: true };
      const err = await res.json().catch(() => ({}));
      console.error("[Twilio] Failed:", err);
      return { sent: false, reason: "provider_error" };
    } catch (err) {
      console.error("[Twilio] Network error:", err);
      return { sent: false, reason: "network_error" };
    }
  }

  return { sent: false, reason: "no_provider" };
}

// ─── Main handler ─────────────────────────────────────────────────────────────
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

    if (!validateTarget(target, type)) {
      return NextResponse.json(
        {
          success: false,
          error: type === "email"
            ? "Please enter a valid email address."
            : "Please enter a valid phone number.",
        },
        { status: 400 }
      );
    }

    if (isRateLimited(target)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please wait 10 minutes before trying again." },
        { status: 429 }
      );
    }

    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    global.otpStore.set(target.trim().toLowerCase(), { otp, expiresAt, type, attempts: 0 });

    // ── Attempt real delivery ──────────────────────────────────────────────────
    let deliveryResult = { sent: false, reason: "no_provider" };

    if (type === "email") {
      deliveryResult = await sendEmailOtp(target.trim(), otp);
    } else if (type === "phone") {
      deliveryResult = await sendSmsOtp(target.trim(), otp);
    }

    // ── Dev-mode / Sandbox fallback: show OTP in UI + terminal if no provider configured ──
    const isDevOrSandbox =
      process.env.NODE_ENV === "development" ||
      process.env.ENABLE_OTP_SANDBOX === "true";

    if (!deliveryResult.sent) {
      console.warn(
        `[MOULEETA] No ${type} provider configured. OTP for ${target}: \x1b[33m${otp}\x1b[0m`
      );

      if (isDevOrSandbox) {
        // Expose devOtp in development or when ENABLE_OTP_SANDBOX="true" in Vercel
        return NextResponse.json({
          success: true,
          message: `No ${type} provider configured. Sandbox OTP shown below for testing.`,
          expiresIn: "10 minutes",
          devOtp: otp, // ← visible in dev/sandbox mode
          devMode: true,
        });
      }

      // Production without provider configured — friendly error
      return NextResponse.json(
        {
          success: false,
          error: `${type === "email" ? "Email" : "SMS"} delivery is not yet configured. Please contact support or sign in with Google.`,
        },
        { status: 503 }
      );
    }

    // ── Successfully sent via provider ─────────────────────────────────────────
    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to your ${type === "email" ? "email address" : "phone number"}.`,
      expiresIn: "10 minutes",
    });

  } catch (error) {
    console.error("Error dispatching OTP:", error);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch verification code. Please try again." },
      { status: 500 }
    );
  }
}
