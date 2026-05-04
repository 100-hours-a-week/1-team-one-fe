import {
  getMomentsPageServerSideProps,
  MomentsPage,
  type MomentsPageProps,
} from '@/src/pages/moments';
import { MOMENTS_PAGE_MESSAGES } from '@/src/pages/moments/config/messages';
import { createPublicLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout<MomentsPageProps> = MomentsPage;
Page.getLayout = createPublicLayout({
  headerConfig: {
    variant: 'sub',
    title: MOMENTS_PAGE_MESSAGES.TITLE,
  },
});

export const getServerSideProps = getMomentsPageServerSideProps;

export default Page;
