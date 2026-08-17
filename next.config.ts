import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Ngrok/Localtunnel/LAN IPs to proxy dev server safely
  // @ts-ignore - Next.js 16 HMR host config
  allowedDevOrigins: [
    "few-numbers-stay.loca.lt",
    "192.168.1.6",
    "localhost"
  ]
};

export default nextConfig;
