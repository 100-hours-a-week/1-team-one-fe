import '@/styles/globals.css';

import { withProviders } from '@/src/providers/withProviders';
import { useRouteLoading } from '@/src/shared/model/loading';
import type { AppPropsWithLayout } from '@/src/shared/types';
import { ErrorBoundary } from '@/src/shared/ui/error-boundary';
import { GlobalLoadingOverlay } from '@/src/shared/ui/loading';

function App({ Component, pageProps }: AppPropsWithLayout) {
  useRouteLoading();
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
      <GlobalLoadingOverlay />
      {getLayout(<Component {...pageProps} />)}
    </ErrorBoundary>
  );
}

export default withProviders(App);
