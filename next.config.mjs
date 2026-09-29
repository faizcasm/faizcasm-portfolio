/** @type {import('next').NextConfig} */

/**
 * Site makes no third-party script/frame requests — all data fetching is
 * server-side — so the CSP can be tight. 'unsafe-inline' is still needed for
 * next-themes' inline script and Tailwind's <style> tags (a nonce-based CSP
 * would require rewiring the app shell for marginal gain here).
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'self'",
  // 'self', not 'none': the resume page embeds our own PDF via <object>.
  // Cross-site framing is still blocked (clickjacking protection remains).
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "**" },
      { protocol: "https", hostname: "github-readme-stats.vercel.app", pathname: "**" },
      { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // The admin panel must never be framed or indexed.
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
  experimental: {
    // posts/*.md are read via fs with a dynamic path, so the bundler cannot
    // discover them on its own — without this the markdown fallback (no
    // DATABASE_URL on Vercel) would 404 on ISR revalidation.
    outputFileTracingIncludes: {
      "/(.*)": ["./posts/*.md"],
    },
  },
};

export default nextConfig;
