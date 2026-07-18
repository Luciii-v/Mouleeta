"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import OtpVerificationModal from '@/components/OtpVerificationModal';

export default function LoginPage() {
  const router = useRouter();
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpTarget, setOtpTarget] = useState("");
  const [otpType, setOtpType] = useState("email");
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  return (
    <main className="min-h-screen flex bg-[#F9F8F6]">
      
      {/* LEFT SIDE: Cinematic Editorial Image (Hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <motion.div
          initial={{ scale: 1.0 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 w-full h-full"
        >
          <Image 
            src="/georgette-dress.png" 
            alt="Mouleeta Editorial" 
            fill 
            className="object-cover object-center grayscale-[20%]"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/10 z-10" />
      </div>

      {/* RIGHT SIDE: Minimalist Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center">
        <div className="flex flex-col max-w-md w-full mx-auto justify-center h-full px-8 py-24">
          <div className="flex flex-col gap-3 mb-10 text-center md:text-left">
            <h1 className="text-3xl tracking-widest uppercase font-light font-jost text-stone-900">Sign In</h1>
            <p className="text-sm text-stone-500 font-inter font-light">
              Continue securely with Google to access your Mouleeta profile.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/account' })}
              className="flex items-center justify-center gap-3 w-full bg-stone-900 text-white py-4 text-xs tracking-widest uppercase hover:bg-stone-800 transition-colors font-metropolis cursor-pointer"
            >
              {/* Monochrome Minimal SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
              </svg>
              Continue with Google
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-stone-200"></div>
              <span className="flex-shrink-0 mx-4 text-[10px] tracking-widest text-stone-400 uppercase font-metropolis">
                OR SECURE SIGN IN VIA OTP
              </span>
              <div className="flex-grow border-t border-stone-200"></div>
            </div>

            {!showOtpInput ? (
              <button
                type="button"
                onClick={() => setShowOtpInput(true)}
                className="w-full border border-stone-900 bg-white text-stone-900 py-4 text-xs tracking-widest uppercase hover:bg-stone-900 hover:text-white transition-colors font-metropolis cursor-pointer"
              >
                Continue with Email / Phone OTP
              </button>
            ) : (
              <div className="space-y-3 bg-stone-50 border border-stone-200 p-4 animate-fadeIn">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOtpType("email")}
                    className={`flex-1 py-2 text-[10px] font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                      otpType === "email" ? "bg-black text-white" : "bg-white border border-stone-200 text-stone-600"
                    }`}
                  >
                    📧 Email OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtpType("phone")}
                    className={`flex-1 py-2 text-[10px] font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                      otpType === "phone" ? "bg-black text-white" : "bg-white border border-stone-200 text-stone-600"
                    }`}
                  >
                    📱 Phone SMS
                  </button>
                </div>
                <input
                  type={otpType === "email" ? "email" : "tel"}
                  placeholder={otpType === "email" ? "Enter your email (e.g. name@domain.com)" : "Enter mobile (+91 98200...)"}
                  value={otpTarget}
                  onChange={(e) => setOtpTarget(e.target.value)}
                  className="w-full border border-stone-300 bg-white px-3.5 py-3 text-sm text-stone-900 focus:outline-none focus:border-black rounded-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowOtpInput(false)}
                    className="w-1/3 border border-stone-300 py-2.5 text-[11px] uppercase tracking-wider text-stone-600 hover:text-black cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!otpTarget.trim()}
                    onClick={() => setOtpModalOpen(true)}
                    className="w-2/3 bg-black text-white py-2.5 text-[11px] font-medium uppercase tracking-wider hover:bg-stone-800 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    Dispatch Passcode →
                  </button>
                </div>
              </div>
            )}

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-stone-200"></div>
              <span className="flex-shrink-0 mx-4 text-xs tracking-widest text-stone-400 uppercase font-metropolis">
                New to Mouleeta?
              </span>
              <div className="flex-grow border-t border-stone-200"></div>
            </div>

            <Link href="/account/register" className="w-full border border-stone-300 py-4 text-xs tracking-widest uppercase hover:border-stone-900 transition-colors font-metropolis text-center text-stone-900 cursor-pointer hover:bg-stone-50">
              Create Profile
            </Link>
          </div>
        </div>
      </div>

      <OtpVerificationModal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        target={otpTarget}
        type={otpType}
        onVerified={() => {
          router.push('/account');
        }}
      />
    </main>
  );
}
