import type { NextConfig } from "next";

// Comprehensive HTTP Security Headers for MOULEETA V.2
// Protects against clickjacking, MIME sniffing, XSS, and data leakage.
// Firebase Phone Auth requires Google reCAPTCHA and googleapis domains.
const securityHeaders = [
  // Prevent the site from being embedded in iframes (clickjacking protection)
  // NOTE: SAMEORIGIN allows Google's reCAPTCHA iframes (they use same-origin frames)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Prevent MIME type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Enable DNS prefetching for performance
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Control referrer information sent with requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restrict access to sensitive browser APIs
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
  // Force HTTPS for 2 years, include subdomains, preload eligible
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Required for Google OAuth popup AND Firebase Phone Auth reCAPTCHA popup
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  // Content Security Policy — permits Firebase Phone Auth (reCAPTCHA) + Google APIs
  {
    key: "Content-Security-Policy",
    value: [
      // Self + inline (Next.js hot reload, styled-components)
      "default-src 'self'",
      // Scripts: self + inline (Next.js requires 'unsafe-inline' for dev) + Google reCAPTCHA + Firebase
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://apis.google.com https://recaptchaenterprise.googleapis.com https://*.firebaseapp.com",
      // Styles: self + inline (Tailwind CSS)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts: self + Google Fonts
      "font-src 'self' https://fonts.gstatic.com data:",
      // Images: self + CDN (Shopify) + Google (for profile pictures) + data URIs
      "img-src 'self' data: blob: https://cdn.shopify.com https://lh3.googleusercontent.com https://www.gstatic.com",
      // Frames: Google reCAPTCHA (invisible recaptcha renders an iframe) + Firebase auth
      "frame-src 'self' https://www.google.com https://recaptcha.google.com https://*.firebaseapp.com https://mouleeta-shop.firebaseapp.com",
      // API connections: self + Firebase + Google APIs + Resend + Shopify + Shiprocket
      "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebasedatabase.app wss://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://api.resend.com https://kvd0hr-0x.myshopify.com https://apiv2.shiprocket.in https://api.razorpay.com",
      // Workers: blob (Next.js service worker)
      "worker-src 'self' blob:",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
      {
        // Google profile pictures (used when signed in with Google OAuth)
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
