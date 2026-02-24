import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://image.tmdb.org https://*.googleusercontent.com https://avatars.githubusercontent.com https://i.ytimg.com; font-src 'self' data:; connect-src 'self' https://api.themoviedb.org https://www.youtube.com; frame-src 'self' https://www.youtube.com https://youtube.com;"
          }
        ],
      },
    ];
  },
  reactCompiler: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [25, 50, 75, 85, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/t/p/**",
      },
    ],
  },
  serverExternalPackages: ["@prisma/client", "bcrypt"],
};

export default nextConfig;
