"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import OtpVerificationModal from '@/components/OtpVerificationModal';

export default function LoginPage() {
  const router = useRouter();
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpTarget, setOtpTarget] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [otpType, setOtpType] = useState("email");
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalType, setLegalType] = useState("terms");
  return (
    <main className="min-h-screen flex bg-[#F9F8F6]">
      
      {/* LEFT SIDE: Logo (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-[#1A1A1A]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <Image 
            src="/logo.svg" 
            alt="Mouleeta" 
            width={300}
            height={100}
            className="w-48 md:w-64 invert"
            priority
          />
          <motion.h2 
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            className="mt-4 text-white text-2xl font-light tracking-[0.5em] uppercase font-jost"
          >
            Mouleeta
          </motion.h2>
        </motion.div>
      </div>

      {/* RIGHT SIDE: Minimalist Form */}
      <div className="w-full lg:w-1/2 bg-transparent flex flex-col justify-center">
        <div className="flex flex-col max-w-md w-full mx-auto justify-center h-full px-8 py-24">
          <div className="flex flex-col gap-2 mb-10 text-center md:text-left">
            <h1 className="text-3xl font-jost text-stone-900 font-medium">Welcome to Privé</h1>
            <p className="text-sm text-stone-500 font-inter font-light">
              Experience conscious luxury tailored to your essence.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-stone-900 font-metropolis tracking-wider uppercase">Mobile Number</label>
              <div className="flex w-full border border-stone-300 bg-white rounded-md shadow-sm overflow-hidden focus-within:border-stone-500">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-stone-50 border-r border-stone-200 px-3 py-3.5 text-sm text-stone-600 focus:outline-none cursor-pointer"
                >
                  <option value="+91">+91 (IN)</option>
                  <option value="+1">+1 (US/CA)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+61">+61 (AU)</option>
                  <option value="+971">+971 (AE)</option>
                  <option value="+33">+33 (FR)</option>
                  <option value="+49">+49 (DE)</option>
                </select>
                <input
                  type="tel"
                  placeholder="Enter mobile"
                  value={otpTarget}
                  onChange={(e) => setOtpTarget(e.target.value)}
                  className="w-full px-3.5 py-3.5 text-sm text-stone-900 focus:outline-none bg-transparent"
                />
              </div>
            </div>
            
            <button
              type="button"
              disabled={!otpTarget.trim() || !acceptedTerms}
              onClick={() => {
                setOtpType("phone");
                setOtpModalOpen(true);
              }}
              className="w-full bg-[#5D7052] text-white py-4 text-xs font-medium tracking-widest uppercase hover:bg-[#4b5a42] transition-colors rounded-md cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign up / Log in with Phone
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-stone-200"></div>
              <span className="flex-shrink-0 mx-4 text-[10px] tracking-widest text-stone-400 uppercase font-metropolis">
                OR
              </span>
              <div className="flex-grow border-t border-stone-200"></div>
            </div>

            <button
              type="button"
              disabled={!acceptedTerms}
              onClick={() => signIn('google', { callbackUrl: '/account' })}
              className="flex items-center justify-center gap-3 w-full bg-[#131314] text-white py-4 text-xs tracking-widest uppercase hover:bg-black transition-colors font-metropolis cursor-pointer border border-stone-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
              Sign up / Log in with Google
            </button>
            
            <div className="mt-8 flex items-start gap-3">
              <input 
                type="checkbox" 
                id="terms-checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900 cursor-pointer accent-stone-800"
              />
              <label htmlFor="terms-checkbox" className="text-[11px] text-stone-400 font-inter cursor-pointer leading-relaxed">
                By signing in, I agree to the 
                <span onClick={(e) => { e.preventDefault(); setLegalType("terms"); setLegalModalOpen(true); }} className="hover:text-stone-600 transition-colors mx-1 cursor-pointer underline underline-offset-2">Terms &amp; Conditions</span> 
                and 
                <span onClick={(e) => { e.preventDefault(); setLegalType("privacy"); setLegalModalOpen(true); }} className="hover:text-stone-600 transition-colors ml-1 cursor-pointer underline underline-offset-2">Privacy Policy</span>.
              </label>
            </div>
          </div>
        </div>
      </div>

      <OtpVerificationModal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        target={`${countryCode} ${otpTarget}`}
        type={otpType}
        onVerified={() => {
          router.push('/account');
        }}
      />

      {/* Legal Modal */}
      <AnimatePresence>
        {legalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="flex justify-between items-center p-5 border-b border-stone-200">
                <h3 className="font-jost text-lg font-medium tracking-wide uppercase text-stone-900">
                  {legalType === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
                </h3>
                <button onClick={() => setLegalModalOpen(false)} className="text-stone-400 hover:text-stone-900 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-grow font-inter text-sm text-stone-600 space-y-4">
                {legalType === 'terms' ? (
                  <>
                    <p>Welcome to Mouleeta. By accessing our platform, you agree to these terms.</p>
                    <p><strong>1. Use of Service:</strong> You must be at least 18 years old to use our services.</p>
                    <p><strong>2. Intellectual Property:</strong> All content, designs, and logos are the property of Mouleeta and are protected by international copyright laws.</p>
                    <p><strong>3. Purchases:</strong> All purchases are subject to availability. We reserve the right to refuse or cancel any order.</p>
                    <p><strong>4. Returns & Exchanges:</strong> Items must be returned in their original condition within 14 days of delivery.</p>
                  </>
                ) : (
                  <>
                    <p>Your privacy is of utmost importance to Mouleeta. This policy outlines how we handle your data.</p>
                    <p><strong>1. Data Collection:</strong> We collect information you provide directly, such as when you create an account, make a purchase, or contact us.</p>
                    <p><strong>2. Data Usage:</strong> We use your information to process transactions, send updates, and improve your shopping experience.</p>
                    <p><strong>3. Data Sharing:</strong> We do not sell your personal data. We may share information with trusted third-party service providers essential to operating our business.</p>
                    <p><strong>4. Security:</strong> We implement industry-standard security measures to protect your personal information.</p>
                  </>
                )}
              </div>
              <div className="p-5 border-t border-stone-200 bg-stone-50 flex justify-end">
                <button
                  onClick={() => setLegalModalOpen(false)}
                  className="bg-stone-900 text-white px-6 py-2 text-xs font-medium tracking-widest uppercase hover:bg-stone-800 transition-colors rounded"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
