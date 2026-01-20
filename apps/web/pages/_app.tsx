import '@/styles/globals.css';

import type { AppPropsWithLayout } from '@/src/shared/types';
import { withProviders } from '@/src/widgets/providers/withProviders';

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(<Component {...pageProps} />);
}

export default withProviders(App);
