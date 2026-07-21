"use client";
import React, { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";

export default function OtpVerificationModal({
  isOpen,
  onClose,
  target,
  type = "email", // "email" | "phone"
  onVerified,
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [devOtp, setDevOtp] = useState(""); // Only populated in development mode
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef([]);

  // Send OTP when modal opens or resend clicked
  const sendOtpCode = async () => {
    if (!target) return;
    setSending(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, type }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.devOtp) setDevOtp(data.devOtp); // dev mode only
        setCountdown(30);
      } else {
        setError(data.error || "Failed to send code.");
      }
    } catch {
      setError("Network error sending code.");
    } finally {
      setSending(false);
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setError("");
      setSuccessMsg("");
      setDevOtp("");
      sendOtpCode();
      if (inputRefs.current[0]) {
        setTimeout(() => inputRefs.current[0]?.focus(), 150);
      }
    }
  }, [isOpen, target]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  useEffect(() => {
    let timer;
    if (isOpen && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, countdown]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto move focus forward
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleVerify = async (codeToVerify) => {
    const fullOtp = codeToVerify || otp.join("");
    if (fullOtp.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, otp: fullOtp }),
      });
      const data = await res.json();
      if (data.success || data.verified) {
        setSuccessMsg("✨ Identity verified successfully!");

        // Create a real NextAuth session for OTP-authenticated users
        await signIn("otp-verified", {
          target,
          type,
          verified: "true",
          redirect: false,
        });

        setTimeout(() => {
          onVerified(target, type);
          onClose();
        }, 1200);
      } else {
        setError(data.error || "Invalid security code.");
      }
    } catch {
      setError("Verification failed due to network error.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white border border-stone-200 shadow-2xl max-w-md w-full p-6 sm:p-8 relative rounded-sm">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-black text-lg p-1 cursor-pointer transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-3.5 border border-stone-200/80">
            {type === "email" ? (
              <svg className="w-5 h-5 text-stone-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-stone-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-stone-900">
            Privé Security Verification
          </h3>
          <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
            We dispatched a 6-digit verification code to{" "}
            <span className="font-medium text-stone-800">{target}</span>. Enter below to verify ownership.
          </p>
        </div>

        {/* Dev-mode sandbox banner — only visible in development when no email/SMS provider is set */}
        {devOtp && (
          <div className="mb-6 bg-stone-900 text-white p-3 rounded-sm flex items-center justify-between text-xs tracking-wider border border-stone-800 shadow-inner">
            <div>
              <span className="text-stone-400 text-[10px] uppercase block mb-0.5">Dev Mode — No Provider Configured</span>
              <span className="font-mono font-bold tracking-widest text-emerald-400 text-sm">{devOtp}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const arr = devOtp.split("");
                setOtp(arr);
                handleVerify(devOtp);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider transition-colors cursor-pointer rounded-sm"
            >
              ⚡ Auto-Fill &amp; Verify
            </button>
          </div>
        )}

        {/* OTP Input Squares */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-6" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-11 sm:w-12 h-12 sm:h-14 text-center text-lg sm:text-xl font-medium font-mono border border-stone-300 bg-stone-50 text-stone-900 focus:bg-white focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all rounded-none"
            />
          ))}
        </div>

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
          onClick={() => handleVerify()}
          disabled={loading || otp.join("").length < 6}
          className="w-full bg-black text-white py-3.5 text-xs font-medium uppercase tracking-[0.2em] hover:bg-stone-800 transition-colors disabled:opacity-50 cursor-pointer shadow-sm mb-4"
        >
          {loading ? "Verifying Token..." : "Verify Security Code"}
        </button>

        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-[11px] text-stone-400 tracking-wider">
              Resend passcode in{" "}
              <span className="font-mono text-stone-600">
                0:{countdown < 10 ? `0${countdown}` : countdown}
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={sendOtpCode}
              disabled={sending}
              className="text-xs text-stone-900 font-medium uppercase tracking-wider underline hover:text-stone-600 transition-colors cursor-pointer"
            >
              {sending ? "Sending..." : "Resend Passcode"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
