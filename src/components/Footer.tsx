'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Leaf, Truck } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    // TODO: Wire to Mailchimp/Klaviyo/Shopify Email API
    setSubscribed(true);
    setEmail('');
  };

  // We define the parent variant to stagger the children by 0.2 seconds
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // We define the animation every child element will use
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const }
    },
  };

  return (
    <footer className="bg-[#1A1A1A] text-white pt-32 pb-12 px-8 flex flex-col items-center overflow-hidden">

      {/* Newsletter Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col items-center text-center max-w-2xl mb-32 w-full"
      >
        <motion.h2 variants={itemVariants} className="font-jost font-light text-4xl md:text-5xl tracking-[0.2em] uppercase mb-6">
          Join Our Journey
        </motion.h2>

        <motion.p variants={itemVariants} className="font-inter text-gray-400 font-light mb-10 text-sm md:text-base">
          Be the first to discover new collections and conscious fashion insights.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row w-full gap-4 justify-center">
          {subscribed ? (
            <div className="flex items-center justify-center gap-3 py-4 px-8 border border-emerald-500/30 bg-emerald-500/10 w-full sm:w-auto">
              <span className="text-emerald-400 text-sm font-inter tracking-wider">✓ Thank you — you&apos;re on the list.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row w-full gap-4 justify-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="bg-transparent border border-white/20 px-6 py-4 w-full sm:w-96 font-inter text-sm outline-none focus:border-white transition-colors placeholder:text-gray-600"
              />
              <button type="submit" className="bg-white text-[#1A1A1A] px-10 py-4 font-jost uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors cursor-pointer">
                Subscribe
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="w-full max-w-6xl border-t border-white/10 pt-16 pb-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:scale-110 hover:border-white transition-all duration-500 text-gray-300 hover:text-white cursor-pointer">
            <Leaf size={22} strokeWidth={1} />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="font-jost uppercase tracking-[0.2em] text-xs text-white">Organic Materials</h4>
            <p className="font-inter text-xs text-gray-500 font-light max-w-xs">Consciously sourced fabrics designed for zero waste.</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:scale-110 hover:border-white transition-all duration-500 text-gray-300 hover:text-white cursor-pointer">
            <Shield size={22} strokeWidth={1} />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="font-jost uppercase tracking-[0.2em] text-xs text-white">Lifetime Guarantee</h4>
            <p className="font-inter text-xs text-gray-500 font-light max-w-xs">Built to last. Free repairs on all items for life.</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:scale-110 hover:border-white transition-all duration-500 text-gray-300 hover:text-white cursor-pointer">
            <Truck size={22} strokeWidth={1} />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="font-jost uppercase tracking-[0.2em] text-xs text-white">Carbon Neutral</h4>
            <p className="font-inter text-xs text-gray-500 font-light max-w-xs">Complimentary, offset shipping worldwide.</p>
          </div>
        </div>
      </motion.div>

      {/* Lower Footer Links (Fades in slightly after the newsletter) */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.4 }}
        className="w-full max-w-6xl border-t border-white/10 pt-12 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm font-inter text-gray-400"
      >
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/logo.svg"
              alt="MOULEETA Crown"
              width={24}
              height={24}
              className="w-6 h-6 object-contain invert opacity-80"
            />
            <h3 className="font-jost text-white tracking-[0.2em] uppercase text-lg mt-0.5">
              MOULEETA
            </h3>
          </div>
          <p className="font-light text-xs tracking-widest leading-loose">CRAFTED CONSCIOUSLY.<br />PREMIUM FASHION.</p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-white font-jost tracking-widest uppercase text-xs mb-2">Shop</h4>
          <Link href="/shop" className="hover:text-white transition-colors">New Arrivals</Link>
          <Link href="/shop" className="hover:text-white transition-colors">All Products</Link>
          <Link href="/collections/dresses" className="hover:text-white transition-colors">Dresses</Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-white font-jost tracking-widest uppercase text-xs mb-2">About</h4>
          <Link href="/about" className="hover:text-white transition-colors">Our Story</Link>
          <Link href="/philosophy" className="hover:text-white transition-colors">Sustainability</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-white font-jost tracking-widest uppercase text-xs mb-2">Help</h4>
          <Link href="/track" className="hover:text-white transition-colors text-amber-200 font-medium">Track Order &amp; Returns</Link>
          <Link href="/policies/shipping" className="hover:text-white transition-colors">Shipping</Link>
          <Link href="/policies/returns" className="hover:text-white transition-colors">Returns</Link>
          <Link href="/policies/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.6 }}
        className="w-full max-w-6xl mt-24 flex justify-between items-center text-xs text-gray-500 font-inter"
      >
        <p>© 2026 MOULEETA. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/policies/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/policies/terms" className="hover:text-white transition-colors">Terms</Link>
          <a href="https://instagram.com/mouleetafashion" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
        </div>
      </motion.div>
    </footer>
  );
}
