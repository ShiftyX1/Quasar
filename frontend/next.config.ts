import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['antd'],
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
