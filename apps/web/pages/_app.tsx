import '@/styles/globals.css';

import { withProviders } from '@/src/providers/withProviders';
import type { AppPropsWithLayout } from '@/src/shared/types';

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(<Component {...pageProps} />);
}

export default withProviders(App);
