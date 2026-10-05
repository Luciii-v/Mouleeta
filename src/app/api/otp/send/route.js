export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { activateOtp, createOtp, isOtpPurpose, normalizeEmail, revokeOtp } from "@/lib/otp";
import { isRateLimited, requestAddress } from "@/lib/rate-limit";

function response(body, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

async function sendEmailOtp(to, otp) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

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
            <div style="text-align: center; margin-bottom: 32px;">
              <img src="https://www.mouleeta.shop/logo.svg" alt="MOULEETA" style="height: 32px; width: auto;" />
            </div>
            <p style="font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #999; text-align: center;">MOULEETA PRIVÉ</p>
            <h2 style="font-weight: 300; font-size: 24px; color: #1A1A1A;">Verification Code</h2>
            <p style="font-size: 14px; color: #666; line-height: 1.6;">Use the code below to verify your identity. It expires in <strong>10 minutes</strong>.</p>
            <div style="background: #1A1A1A; color: #FAFAF8; text-align: center; padding: 24px; letter-spacing: 0.5em; font-size: 32px; font-family: monospace; margin: 32px 0;">${otp}</div>
            <p style="font-size: 12px; color: #999;">If you did not request this code, ignore this email. Do not share it with anyone.</p>
          </div>
        `,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) console.error("OTP email delivery failed with status:", res.status);
    return res.ok;
  } catch {
    // Provider error objects can contain recipients/request payloads.
    console.error("OTP email delivery unavailable");
    return false;
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const target = normalizeEmail(body?.target);
    const purpose = body?.purpose ?? "sign-in";
    if (body?.type !== "email" || !target || !isOtpPurpose(purpose)) {
      return response({ success: false, error: "Invalid email verification request." }, 400);
    }

    // Phone authentication is handled by Firebase, never by this email store.
    if (
      await isRateLimited(`otp-send:ip:${requestAddress(req)}`, 10, 10 * 60 * 1000) ||
      await isRateLimited(`otp-send:target:${target}`, 3, 10 * 60 * 1000)
    ) {
      return response({ success: false, error: "Too many requests. Please try again later." }, 429);
    }

    const { otp, challengeId } = await createOtp(target, purpose);
    const devSandbox = process.env.NODE_ENV === "development" &&
      process.env.OTP_DEV_SANDBOX === "true" && !process.env.RESEND_API_KEY;
    const sent = devSandbox || await sendEmailOtp(target, otp);

    if (!sent) {
      await revokeOtp(target, purpose, challengeId);
      return response({ success: false, error: "Email delivery is unavailable. Please try again or sign in with Google." }, 503);
    }

    if (!await activateOtp(target, purpose, challengeId)) {
      return response({ success: false, error: "Please use your most recently requested code." }, 409);
    }

    return response({
      success: true,
      message: "A verification code has been dispatched to your email address.",
      expiresIn: "10 minutes",
      ...(devSandbox ? { devOtp: otp, devMode: true } : {}),
    });
  } catch (error) {
    console.error("OTP dispatch unavailable");
    return response({ success: false, error: "Unable to send a verification code." }, error instanceof SyntaxError ? 400 : 503);
  }
}
