"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RecoverPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F9F8F6] px-6">
      <div className="max-w-md w-full animate-fadeIn">
        {/* Back to login */}
        <Link
          href="/account/login"
          className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase text-stone-500 hover:text-black transition-colors mb-12"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </Link>

        <h1 className="text-3xl font-light tracking-[0.2em] text-stone-900 uppercase mb-2">
          Recover Account
        </h1>
        <p className="text-sm text-stone-500 font-light tracking-widest mb-12">
          Enter your email and we&rsquo;ll send you a link to reset your password.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                id="recover-email"
                className="block w-full px-0 py-3 text-sm text-stone-900 bg-transparent border-0 border-b border-stone-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer transition-colors"
                placeholder=" "
                required
              />
              <label
                htmlFor="recover-email"
                className="absolute text-[11px] tracking-[0.15em] uppercase text-stone-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Email Address
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-stone-900 text-white text-xs tracking-[0.2em] uppercase py-4 mt-4 hover:bg-black hover:shadow-lg transition-all duration-300"
            >
              Send Recovery Link
            </button>
          </form>
        ) : (
          /* Success State */
          <div className="text-center py-8 border border-stone-200 px-8">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-5 h-5 text-stone-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </div>
            <h2 className="text-lg font-light tracking-[0.15em] text-stone-900 uppercase mb-3">
              Check Your Email
            </h2>
            <p className="text-sm text-stone-500 font-light tracking-wide leading-relaxed mb-8">
              If an account exists with that email, you&rsquo;ll receive a password reset link shortly.
            </p>
            <Link
              href="/account/login"
              className="inline-block border border-stone-900 text-stone-900 px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-stone-900 hover:text-white transition-colors duration-300"
            >
              Return to Sign In
            </Link>
          </div>
        )}

        {/* Register Link */}
        <div className="mt-12 text-center border-t border-stone-200 pt-8">
          <p className="text-[11px] tracking-widest uppercase text-stone-500 mb-4">
            Don&rsquo;t have an account?
          </p>
          <Link
            href="/account/register"
            className="inline-block border border-stone-900 text-stone-900 px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-stone-900 hover:text-white transition-colors duration-300 w-full"
          >
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}
