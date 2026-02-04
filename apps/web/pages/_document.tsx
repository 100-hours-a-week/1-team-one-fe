import { Head, Html, Main, NextScript } from 'next/document';

const PRELOAD_FONTS = [
  '/fonts/Pretendard-Medium.woff2',
  '/fonts/Pretendard-SemiBold.woff2',
] as const;

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/logo-180.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Growing Developer" />
        {PRELOAD_FONTS.map((font) => (
          <link
            key={font}
            rel="preload"
            href={font}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
