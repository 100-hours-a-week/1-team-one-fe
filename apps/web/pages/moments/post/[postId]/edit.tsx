import { MomentsEditPage } from '@/src/pages/moments-edit';
import { MOMENTS_EDIT_PAGE_MESSAGES } from '@/src/pages/moments-edit/config/messages';
import { createAuthenticatedLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = MomentsEditPage;
Page.getLayout = createAuthenticatedLayout({
  headerConfig: {
    variant: 'sub',
    title: MOMENTS_EDIT_PAGE_MESSAGES.TITLE,
    back: true,
  },
});

export default Page;
