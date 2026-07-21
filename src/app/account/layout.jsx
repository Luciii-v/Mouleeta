"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function AccountLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  // Hide the dashboard layout on login, register, and recover routes
  const isAuthRoute =
    pathname?.startsWith("/account/login") ||
    pathname?.startsWith("/account/register") ||
    pathname?.startsWith("/account/recover");

  if (isAuthRoute) {
    return <>{children}</>;
  }

  // — Auth Guard —
  // Show a minimal luxury loading state while session resolves
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-5 h-5 border border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-metropolis">
            Authenticating
          </p>
        </div>
      </div>
    );
  }

  // Redirect unauthenticated users to login
  if (status === "unauthenticated") {
    router.replace("/account/login");
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-metropolis">
          Redirecting…
        </p>
      </div>
    );
  }

  const handleLogout = () => {
    try {
      signOut({ callbackUrl: "/" });
    } catch {
      window.location.href = "/";
    }
  };

  // Derive display name from session
  const displayName = session?.user?.name || "Privé Member";
  const firstName = displayName.split(" ")[0];

  const navItems = {
    ORDERS: [
      { label: "Orders & Returns", href: "/account/orders" },
    ],
    PROFILE: [
      { label: "Profile Details", href: "/account/profile" },
      { label: "Saved Addresses", href: "/account/addresses" },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-32 md:pt-36 pb-20 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 md:gap-14">
        
        {/* Left Sidebar (Static) */}
        <aside className="w-full md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-200/80 pb-8 md:pb-0 md:pr-8">
          
          {/* User Name at the top */}
          <div className="mb-10 pb-6 border-b border-gray-200/60">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-medium block mb-1">
              Welcome back, {firstName}
            </span>
            <h2 className="text-xl font-light tracking-tight text-gray-900 font-serif">
              {displayName}
            </h2>
            {session?.user?.email && (
              <p className="text-xs text-gray-400 mt-1 truncate">{session.user.email}</p>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-8">
            
            {/* ORDERS Section */}
            <div>
              <p className="text-xs text-gray-400 font-semibold tracking-[0.15em] uppercase mb-3">
                ORDERS
              </p>
              <ul className="space-y-2">
                {navItems.ORDERS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`block text-sm transition-all duration-200 ${
                          isActive
                            ? "text-black font-medium pl-2 border-l-2 border-black"
                            : "text-gray-700 hover:text-black hover:font-medium"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* PROFILE Section */}
            <div>
              <p className="text-xs text-gray-400 font-semibold tracking-[0.15em] uppercase mb-3">
                PROFILE
              </p>
              <ul className="space-y-2">
                {navItems.PROFILE.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`block text-sm transition-all duration-200 ${
                          isActive
                            ? "text-black font-medium pl-2 border-l-2 border-black"
                            : "text-gray-700 hover:text-black hover:font-medium"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* ACTION Section */}
            <div className="pt-4 border-t border-gray-200/60">
              <p className="text-xs text-gray-400 font-semibold tracking-[0.15em] uppercase mb-3">
                ACTION
              </p>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>Log Out</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
