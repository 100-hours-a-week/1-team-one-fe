import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone', 
  /* config options here */
  reactStrictMode: true,
  transpilePackages: ['@repo/ui'],
};

export default nextConfig;
