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
  async rewrites() {
    return [
      {
        source: '/api/auth/keycloak/:path*',
        destination: 'http://localhost:8000/api/auth/keycloak/:path*',
      },
    ];
  },
};

export default nextConfig;
