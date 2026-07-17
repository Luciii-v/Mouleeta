"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // For account dashboard routes (profile, orders, addresses), use a single static key
  // so the layout/sidebar stays mounted and navigation between sections is seamless without page reload/animation flash.
  const isAccountDashboard =
    pathname?.startsWith("/account") &&
    !pathname?.startsWith("/account/login") &&
    !pathname?.startsWith("/account/register") &&
    !pathname?.startsWith("/account/recover");

  const motionKey = isAccountDashboard ? "account-dashboard" : pathname;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={motionKey}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
