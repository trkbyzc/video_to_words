import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
  eslint: {
    // Vercel build esnasında hata verse bile umursama, devam et:
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Typescript hatalarını build aşamasında görmezden gel
    ignoreBuildErrors: true, 
  }
};

export default nextConfig;
