import bundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

type RemotePattern = NonNullable<NonNullable<NextConfig['images']>['remotePatterns']>[number];

function createRemotePatternFromUrl(url?: string): RemotePattern | null {
  if (!url) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol.replace(':', '');

    if (protocol !== 'http' && protocol !== 'https') {
      return null;
    }

    const pathname =
      parsedUrl.pathname === '/' ? '/**' : `${parsedUrl.pathname.replace(/\/$/, '')}/**`;

    return {
      protocol,
      hostname: parsedUrl.hostname,
      pathname,
    };
  } catch {
    return null;
  }
}

const envImageRemotePattern = createRemotePatternFromUrl(process.env.NEXT_PUBLIC_GCS_BASE_URL);
const svgComponentLoader = {
  loader: '@svgr/webpack',
  options: {
    dimensions: false,
    expandProps: 'end',
  },
} as const;

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages: ['@repo/ui'],
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [svgComponentLoader],
        as: '*.js',
      },
    },
  },

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
      {
        protocol: 'https',
        hostname: 'raise-developer-dev-bucket.s3.ap-northeast-2.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raise-developer-staging-bucket.s3.ap-northeast-2.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raise-developer-prod-bucket.s3.ap-northeast-2.amazonaws.com',
        pathname: '/**',
      },
      ...(envImageRemotePattern ? [envImageRemotePattern] : []),
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
  // Keep SVG imports consistent across Turbopack(dev) and Webpack(prod):
  // imported `.svg` files are always React components via SVGR.
  // URL-style usage should use `/public/...` string paths instead.
  webpack(config) {
    // 기본 asset 처리 규칙에서 svg 제외
    const assetRule = config.module.rules.find((rule: any) => rule?.test?.test?.('.svg'));
    if (assetRule) assetRule.exclude = /\.svg$/i;

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [svgComponentLoader],
    });
    return config;
  },
};

const isCI = process.env.CI === 'true' || process.env.CI === '1'; //CI 환경인지 감지

export default withSentryConfig(withBundleAnalyzer(nextConfig), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // 로컬 빌드에서는 소스맵 업로드 관련 기능 자체를 꺼버림
  sourcemaps: {
    disable: !isCI,
  },

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
