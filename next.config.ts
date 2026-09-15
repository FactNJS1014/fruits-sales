import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🟢 ข้ามการตรวจ Type Checking ชั่วคราวตอนรัน npm run build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // 🟢 ข้ามการตรวจ ESLint ชั่วคราวตอน Build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
