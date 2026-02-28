import { useRouter } from 'next/router';

import { MOMENTS_PAGE_MESSAGES } from '@/src/pages/moments/config/messages';
import { MomentsUserFeedPage } from '@/src/pages/moments-user-feed';
import { createPublicLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

function Page() {
  const { query, isReady } = useRouter();

  if (!isReady) return null;

  const authorId = Number(query.authorId);

  if (isNaN(authorId)) return null;

  return <MomentsUserFeedPage authorId={authorId} />;
}

Page.getLayout = createPublicLayout({
  headerConfig: {
    variant: 'sub',
    title: MOMENTS_PAGE_MESSAGES.TITLE,
    back: true,
  },
});

export default Page as NextPageWithLayout;
