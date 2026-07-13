"use client";
import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AccountDashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-[1px] bg-stone-900" />
          <p className="font-jost text-xs tracking-[0.25em] uppercase text-stone-600">Loading Profile...</p>
        </div>
      </main>
    );
  }

  // If unauthenticated, display elegant fallback prompt to log in
  if (!session) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center bg-[#FAF9F6] px-6 text-center">
        <div className="max-w-md w-full bg-white p-12 border border-onyx/5 shadow-sm">
          <h1 className="font-jost font-light text-2xl tracking-[0.2em] uppercase text-stone-900 mb-4">
            Mouleeta Privé
          </h1>
          <p className="font-inter text-xs text-stone-500 tracking-wider mb-8 leading-relaxed">
            Please sign in to access your luxury concierge dashboard, order history, and exclusive benefits.
          </p>
          <div className="flex flex-col gap-4">
            <Link 
              href="/account/login" 
              className="bg-stone-900 text-white py-4 text-xs tracking-[0.2em] uppercase hover:bg-black transition-all duration-300 block"
            >
              Sign In
            </Link>
            <Link 
              href="/account/register" 
              className="border border-stone-300 text-stone-900 py-4 text-xs tracking-[0.2em] uppercase hover:border-stone-900 transition-all duration-300 block"
            >
              Create Account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const userName = session.user?.name || "Valued Client";
  const userEmail = session.user?.email || "concierge@mouleeta.com";

  return (
    <main className="min-h-screen bg-[#FAF9F6] py-20 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        
        {/* Editorial Header Banner */}
        <header className="pb-12 mb-16 border-b border-stone-200/80 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="border border-stone-300 text-stone-600 text-[9px] font-light tracking-[0.25em] uppercase px-3 py-1">
                VIP Tier: Gold Privé
              </span>
              <span className="text-[10px] text-stone-400 tracking-widest uppercase flex items-center gap-1">
                <ShieldCheck size={12} strokeWidth={1.5} /> Authenticated Member
              </span>
            </div>
            <h1 className="font-editorial font-medium text-5xl md:text-7xl text-stone-900 tracking-tight leading-tight">
              Welcome, {userName}
            </h1>
            <p className="font-inter text-xs text-stone-500 tracking-widest mt-2">
              {userEmail}
            </p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-stone-500 hover:text-stone-900 transition-colors cursor-pointer w-fit"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </header>

        {/* Dashboard Content Layout: Continuous Stack */}
        <div className="flex flex-col gap-24">
          
          {/* THE ARCHIVE (ORDERS) */}
          <section className="animate-fadeIn space-y-12">
            <h2 className="font-editorial font-medium text-4xl text-stone-900 tracking-tight">
              The Archive
            </h2>
            
            {/* Sample High-End Order Card */}
            <div className="bg-transparent border-y border-stone-200/50 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                <div className="relative w-32 h-44 sm:w-40 sm:h-56 bg-stone-100 flex-shrink-0 overflow-hidden">
                  <Image src="/georgette-dress.png" alt="Order preview" fill className="object-cover" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-900"></span>
                    <span className="text-[10px] tracking-[0.2em] text-zinc-600 uppercase font-medium">
                      Delivered
                    </span>
                  </div>
                  <h4 className="font-jost text-lg uppercase tracking-widest text-stone-900">Order #MOU-8921</h4>
                  <p className="text-xs text-stone-400 tracking-wider font-inter">Placed on May 14, 2026</p>
                </div>
              </div>

              <div className="flex flex-col md:items-end justify-between w-full md:w-auto pt-4 md:pt-0">
                <span className="font-inter text-base text-stone-900">₹18,500</span>
                <Link href="/shop" className="text-[10px] tracking-[0.2em] uppercase text-stone-500 hover:text-stone-900 underline mt-4">
                  View Invoice
                </Link>
              </div>
            </div>

            <div className="text-center pt-4">
              <p className="font-inter text-xs text-stone-400 tracking-wide">
                Showing last 12 months of purchase history.
              </p>
            </div>
          </section>

          {/* SAVED ADDRESSES */}
          <section className="animate-fadeIn space-y-12 border-t border-stone-200/60 pt-16">
            <div className="flex justify-between items-center">
              <h2 className="font-editorial font-medium text-4xl text-stone-900 tracking-tight">
                Saved Addresses
              </h2>
              <button className="text-stone-500 text-[10px] tracking-[0.2em] uppercase hover:text-stone-900 transition-colors border-b border-transparent hover:border-stone-900 pb-1 cursor-pointer">
                + Add New
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-transparent border border-stone-200 p-8 relative">
                <span className="absolute top-6 right-6 text-stone-400 text-[9px] tracking-widest uppercase font-medium">
                  Default
                </span>
                <h4 className="font-jost text-sm uppercase tracking-widest text-stone-900 mb-4">
                  {userName}
                </h4>
                <p className="font-inter text-xs text-stone-600 leading-relaxed tracking-wide">
                  14/B, Pali Hill, Bandra West<br />
                  Mumbai, Maharashtra 400050<br />
                  India<br />
                  Phone: +91 98200 00000
                </p>
                <div className="mt-8 flex gap-6">
                  <button className="text-[10px] tracking-[0.2em] uppercase text-stone-400 hover:text-stone-900 transition-colors cursor-pointer">Edit</button>
                  <button className="text-[10px] tracking-[0.2em] uppercase text-stone-400 hover:text-stone-900 transition-colors cursor-pointer">Remove</button>
                </div>
              </div>
            </div>
          </section>

          {/* PROFILE DETAILS */}
          <section className="animate-fadeIn space-y-12 border-t border-stone-200/60 pt-16">
            <h2 className="font-editorial font-medium text-4xl text-stone-900 tracking-tight">
              Profile Details
            </h2>

            <div className="max-w-2xl space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-stone-400 mb-2">Full Name</label>
                  <p className="font-jost text-base tracking-widest uppercase text-stone-900 font-medium">{userName}</p>
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-stone-400 mb-2">Email Address</label>
                  <p className="font-inter text-sm tracking-wide text-stone-900">{userEmail}</p>
                </div>
              </div>
              
              <div className="pt-4">
                <label className="block text-[10px] tracking-widest uppercase text-stone-400 mb-2">Privé Concierge Preference</label>
                <p className="font-inter text-sm tracking-wide text-stone-600">WhatsApp & Email Notifications enabled for bespoke drops.</p>
              </div>

              <div className="pt-8">
                <button className="border border-stone-300 text-stone-900 text-xs tracking-[0.2em] uppercase px-8 py-4 hover:border-black hover:bg-stone-50 transition-colors cursor-pointer">
                  Update Profile
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
