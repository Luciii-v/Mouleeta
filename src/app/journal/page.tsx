"use client";

import React, { useState } from "react";

export const dynamic = "force-dynamic";

export default function JournalPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputError, setInputError] = useState("");

  const handleNotify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputError("");

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setInputError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    // Simulate async submission — replace with Resend/Klaviyo/Mailchimp API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="bg-[#f6f1e8]">
      {/* Full-height centered content */}
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
        {/* Overline */}
        <p className="font-jost text-xs tracking-[0.3em] uppercase mb-8 text-[#1A1A1A]/40">
          Coming Soon
        </p>

        {/* Title */}
        <h1 className="font-jost font-light text-4xl md:text-5xl tracking-[0.2em] uppercase mb-6 text-[#1A1A1A]">
          The Journal
        </h1>

        {/* Decorative line */}
        <span className="block w-16 h-[1px] bg-[#1A1A1A]/15 mb-8" />

        {/* Description */}
        <p className="font-inter font-light text-sm md:text-[15px] tracking-wide leading-loose text-[#1A1A1A]/70 max-w-lg mb-4">
          A space for stories behind the seams — design inspiration, artisan profiles,{" "}
          conscious living, and the quiet moments that shape each collection.
        </p>

        <p className="font-inter font-light text-sm tracking-wide leading-loose text-[#1A1A1A]/50 max-w-md mb-12">
          We are carefully curating our first stories. Subscribe below to be the first to read them.
        </p>

        {/* Newsletter capture */}
        {!isSubmitted ? (
          <form
            onSubmit={handleNotify}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full max-w-md"
          >
            <div className="w-full flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setInputError(""); }}
                placeholder="Your email address"
                className={`w-full bg-transparent border px-6 py-4 font-inter text-sm text-[#1A1A1A] outline-none transition-colors placeholder:text-[#1A1A1A]/30 tracking-wide ${
                  inputError
                    ? "border-red-400 focus:border-red-500"
                    : "border-[#1A1A1A]/15 focus:border-[#1A1A1A]/40"
                }`}
              />
              {inputError && (
                <p className="text-[10px] text-red-500 tracking-wider mt-1.5 text-left uppercase">
                  {inputError}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-[#1A1A1A] text-[#FDFBF7] font-jost text-[11px] uppercase tracking-[0.2em] px-10 py-4 hover:bg-stone-800 transition-colors whitespace-nowrap disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? "Adding..." : "Notify Me"}
            </button>
          </form>
        ) : (
          <div className="max-w-md w-full border border-[#1A1A1A]/10 px-8 py-6 bg-white/60 backdrop-blur-sm animate-fadeIn">
            <span className="block text-[10px] uppercase tracking-[0.3em] text-[#1A1A1A]/40 mb-2">
              Confirmed
            </span>
            <p className="font-jost font-light text-base tracking-wide text-[#1A1A1A]">
              You&apos;ve been added to the Privé waitlist.
            </p>
            <p className="font-inter text-sm text-[#1A1A1A]/50 mt-1 tracking-wide">
              Expect something extraordinary.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
