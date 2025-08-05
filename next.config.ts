import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ⛔ Abaikan semua error/warning ESLint saat build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
