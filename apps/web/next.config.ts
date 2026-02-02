import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages: ['@repo/ui'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/raise-developer-prod-bucket/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/raise-developer-dev-bucket/**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/firebase-messaging-sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
    ];
  },
  // for svgr
  webpack(config) {
    //기본 svg 처리 규칙에서 svg 제외
    const assetRule = config.module.rules.find((rule: any) => rule?.test?.test?.('.svg'));
    if (assetRule) assetRule.exclude = /\.svg$/i;

    config.module.rules.push({
      test: /\.svg$/i,
      oneOf: [
        // url 방식으로 임포트
        {
          resourceQuery: /url/,
          type: 'asset/resource',
        },
        //컴포넌트 방식으로 임포트
        {
          issuer: /\.[jt]sx?$/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                dimensions: false, //width height 속성 제거
                expandProps: 'end', //props를 맨 뒤에 추가
              },
            },
          ],
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
