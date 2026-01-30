import type { NextPageContext } from 'next';

import { ErrorPage } from '@/src/pages/error';

type ErrorPageProps = {
  statusCode?: number;
};

const resolveVariant = (statusCode?: number) => {
  if (statusCode === 404) return 'not-found';
  if (statusCode && statusCode >= 500) return 'server-error';
  return 'unexpected';
};

function AppErrorPage({ statusCode }: ErrorPageProps) {
  return <ErrorPage variant={resolveVariant(statusCode)} />;
}

AppErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorPageProps => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 500;
  return { statusCode };
};

export default AppErrorPage;
