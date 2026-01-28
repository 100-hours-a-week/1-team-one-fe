import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';

/**
 * getLayout을 지원하는 Page 컴포넌트 타입
 */
export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

/**
 * 레이아웃 포함된 AppProps 타입
 */
export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
