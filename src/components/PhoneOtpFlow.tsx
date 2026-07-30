"use client";

/**
 * PhoneOtpFlow — Firebase Phone Authentication Component
 *
 * Handles the complete phone OTP flow using Firebase Phone Auth:
 * 1. User enters phone number
 * 2. Invisible reCAPTCHA verifies bot protection
 * 3. Firebase sends OTP SMS via Google's carrier network
 * 4. User enters the 6-digit code
 * 5. Firebase confirms → NextAuth session created (via otp-verified provider)
 *
 * Requires Firebase env vars (NEXT_PUBLIC_FIREBASE_*) in .env.local
 * Requires Phone Auth enabled in Firebase Console → Authentication → Sign-in method
 */

import React, { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";

interface PhoneOtpFlowProps {
  phone: string;
  onVerified: (phone: string, type: string) => void;
  onClose: () => void;
  skipSignIn?: boolean;
}

export default function PhoneOtpFlow({ phone, onVerified, onClose, skipSignIn }: PhoneOtpFlowProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  // Normalise Indian phone numbers: ensure +91 prefix
  const normalisePhone = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (digits.length === 10) return `+91${digits}`;
    if (digits.startsWith("91") && digits.length === 12) return `+${digits}`;
    if (digits.startsWith("0") && digits.length === 11) return `+91${digits.slice(1)}`;
    return raw.startsWith("+") ? raw : `+${digits}`;
  };

  // Setup invisible reCAPTCHA on mount
  const initRecaptcha = () => {
    let container = document.getElementById("firebase-recaptcha-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "firebase-recaptcha-container";
      document.body.appendChild(container);
    }
    
    // Return existing verifier to prevent internal Firebase state errors
    if ((window as any).recaptchaVerifier) {
      return (window as any).recaptchaVerifier;
    }

    try {
      const verifier = new RecaptchaVerifier(firebaseAuth, container, {
        size: "invisible",
        callback: () => {},
        "expired-callback": () => {
          setError("reCAPTCHA expired. Please request a new code.");
        },
      });
      (window as any).recaptchaVerifier = verifier;
      return verifier;
    } catch (err) {
      console.error("reCAPTCHA setup error:", err);
      setError("Failed to initialise security check. Please refresh.");
      return null;
    }
  };

  const sendOtpCalledRef = useRef(false);

  useEffect(() => {
    // Initial setup
    const v = initRecaptcha();
    if (v) setRecaptchaReady(true);

    return () => {
      // Intentionally not clearing the verifier here because in React 18 Strict Mode,
      // unmounting and clearing it while signInWithPhoneNumber is in-flight causes a crash.
    };
  }, []);

  // Auto-send OTP when component mounts and reCAPTCHA is ready
  useEffect(() => {
    if (recaptchaReady && phone && !sendOtpCalledRef.current) {
      sendOtpCalledRef.current = true;
      sendOtp();
    }
  }, [recaptchaReady, phone]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const sendOtp = async () => {
    setSending(true);
    setError("");
    try {
      const normalised = normalisePhone(phone);

      const verifier = initRecaptcha();
      if (!verifier) throw new Error("reCAPTCHA not ready — please refresh.");

      const result = await signInWithPhoneNumber(firebaseAuth, normalised, verifier);
      setConfirmationResult(result);
      setCountdown(30);
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
    } catch (err: any) {
      console.error("Firebase phone auth error:", err);
      if (err.code === "auth/invalid-phone-number") {
        setError("Invalid phone number. Please use format: +91 98200 12345.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait a few minutes and try again.");
      } else if (err.code === "auth/quota-exceeded") {
        setError("SMS quota exceeded. Please try again tomorrow or use Email OTP instead.");
      } else if (err.code === "auth/captcha-check-failed") {
        setError("Security check failed. Please refresh the page and try again.");
      } else if (err.code === "auth/missing-phone-number") {
        setError("Please enter a valid phone number.");
      } else {
        setError(err.message || "Failed to send OTP. Please try again.");
      }
    } finally {
      setSending(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    if (!confirmationResult) {
      setError("Session expired. Please request a new OTP.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // Confirm OTP with Firebase
      await confirmationResult.confirm(fullOtp);

      if (!skipSignIn) {
        // Create a NextAuth session so the rest of the app works seamlessly
        await signIn("otp-verified", {
          target: phone,
          type: "phone",
          verified: "true",
          redirect: false,
        });
      }

      setSuccessMsg("✨ Phone verified successfully!");
      setTimeout(() => {
        onVerified(phone, "phone");
        onClose();
      }, 1200);
    } catch (err: any) {
      if (err.code === "auth/invalid-verification-code") {
        setError("Invalid code. Please check and try again.");
      } else if (err.code === "auth/code-expired") {
        setError("Code expired. Please request a new one.");
      } else {
        setError("Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Invisible reCAPTCHA container (required by Firebase) */}
      <div ref={recaptchaContainerRef} id="phone-recaptcha-container" />

      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3.5 border border-stone-200/80">
          <svg className="w-5 h-5 text-stone-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-stone-900">
          Privé Phone Verification
        </h3>
        <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
          {sending ? "Dispatching your verification code…" : (
            <>
              Code sent to <span className="font-medium text-stone-800">{phone}</span>
              {" "}via Firebase Auth.
            </>
          )}
        </p>
      </div>

      {/* OTP Inputs */}
      <div className="flex justify-center gap-2 sm:gap-3 mb-6" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={!confirmationResult || loading}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-11 sm:w-12 h-12 sm:h-14 text-center text-lg sm:text-xl font-medium font-mono border border-stone-300 bg-stone-50 text-stone-900 focus:bg-white focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all rounded-none disabled:opacity-40"
          />
        ))}
      </div>

      {/* Sending state */}
      {sending && (
        <div className="mb-4 flex items-center justify-center gap-2 text-xs text-stone-500 tracking-wider">
          <div className="w-3 h-3 border border-stone-400 border-t-transparent rounded-full animate-spin" />
          Dispatching via Google Firebase…
        </div>
      )}

      {error && (
        <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 text-center rounded-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 text-center rounded-sm font-medium animate-fadeIn">
          {successMsg}
        </div>
      )}

      <button
        type="button"
        onClick={handleVerify}
        disabled={loading || otp.join("").length < 6 || !confirmationResult}
        className="w-full bg-black text-white py-3.5 text-xs font-medium uppercase tracking-[0.2em] hover:bg-stone-800 transition-colors disabled:opacity-50 cursor-pointer shadow-sm mb-4"
      >
        {loading ? "Verifying…" : "Verify Phone Number"}
      </button>

      {/* Resend */}
      <div className="text-center mt-6">
        <button
          type="button"
          onClick={sendOtp}
          disabled={sending || countdown > 0}
          className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 hover:text-black transition-colors underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? "SENDING..." : countdown > 0 ? `RESEND IN ${countdown}s` : "RESEND VIA FIREBASE"}
        </button>
      </div>
    </div>
  );
}
