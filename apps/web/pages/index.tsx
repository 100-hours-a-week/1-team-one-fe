import { Button } from '@repo/ui/button';

import { withPublicLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Home: NextPageWithLayout = function Home() {
  return (
    <Button variant="secondary" size="md">
      Click me
    </Button>
  );
};

Home.getLayout = withPublicLayout;

export default Home;
