// Baseline security headers. script-src retains unsafe-inline for static
// Next.js hydration; see SECURITY.md for the nonce/hash migration tradeoff.
const scriptSrc = "script-src 'self' 'unsafe-inline' https://cdn.shopify.com https://checkout.razorpay.com https://cdn1.judge.me https://judge.me https://*.judge.me";
const websocketSources = process.env.NODE_ENV === 'development'
  ? "ws: wss:"
  : "wss://*.firebaseio.com wss://*.firebasedatabase.app";

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      scriptSrc,
      "script-src-attr 'none'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self' https://checkout.mouleeta.shop https://*.myshopify.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn1.judge.me https://judge.me",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://cdn.shopify.com https://lh3.googleusercontent.com https://www.gstatic.com",
      "frame-src 'self' https://www.google.com https://recaptcha.google.com https://*.firebaseapp.com https://mouleeta-shop.firebaseapp.com",
      `connect-src 'self' ${websocketSources} https://*.googleapis.com https://*.firebaseio.com https://*.firebasedatabase.app https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://api.resend.com https://kvd0hr-0x.myshopify.com https://apiv2.shiprocket.in https://judge.me`,
      "worker-src 'self' blob:",
    ].join("; "),
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
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
