import { OnboardingPwaGuidePage } from '@/src/pages/onboarding-pwa-guide';
import { createAuthenticatedLayout } from '@/src/shared/lib/layout/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = OnboardingPwaGuidePage;
Page.getLayout = createAuthenticatedLayout({ showFooter: false });

export default Page;
