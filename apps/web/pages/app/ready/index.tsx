import { createAuthenticatedLayout } from '@/src/shared/lib/layout/layout';
import type { NextPageWithLayout } from '@/src/shared/types';
import { DevelopingScreen } from '@/src/shared/ui/developing-screen/DevelopingScreen';

const Page: NextPageWithLayout = () => {
  return <DevelopingScreen />;
};

Page.getLayout = createAuthenticatedLayout({
  showFooter: true,
});

export default Page;
