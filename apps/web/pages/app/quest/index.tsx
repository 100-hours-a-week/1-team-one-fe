import { AppQuestPage } from '@/src/pages/app-quest';
import { createAuthenticatedLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = AppQuestPage;

Page.getLayout = createAuthenticatedLayout({
  showFooter: true,
  headerConfig: {
    variant: 'sub',
    title: '퀘스트',
  },
});

export default Page;
