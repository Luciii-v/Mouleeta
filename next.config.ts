import type { NextConfig } from "next";

// Comprehensive HTTP Security Headers for MOULEETA V.2
// Protects against clickjacking, MIME sniffing, XSS, and data leakage.
const securityHeaders = [
  // Prevent the site from being embedded in iframes (clickjacking protection)
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
  // Required for Google OAuth popup to function correctly
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
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
    ],
  },
};

export default nextConfig;
