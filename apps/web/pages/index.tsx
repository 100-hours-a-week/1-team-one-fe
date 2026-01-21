import { Button } from '@repo/ui/button';

import { createPublicLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Home: NextPageWithLayout = function Home() {
  return (
    <Button variant="secondary" size="md">
      Click me
    </Button>
  );
};

Home.getLayout = createPublicLayout();

export default Home;
