import { AppLeaderboardPage } from '@/src/pages/app-leaderboard';
import { createAuthenticatedLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = AppLeaderboardPage;

Page.getLayout = createAuthenticatedLayout({
  showFooter: true,
  headerConfig: {
    variant: 'sub',
    title: '리더보드',
  },
});

export default Page;
