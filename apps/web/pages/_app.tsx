import '@/styles/globals.css';

import { withProviders } from '@/src/providers/withProviders';
import type { AppPropsWithLayout } from '@/src/shared/types';
import { ErrorBoundary } from '@/src/shared/ui/error-boundary';

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ErrorBoundary
      variant="unexpected"
      onError={(error, info) => {
        // TODO: 에러 로깅(Sentry) 연결
        void error;
        void info;
      }}
    >
      {getLayout(<Component {...pageProps} />)}
    </ErrorBoundary>
  );
}

export default withProviders(App);
