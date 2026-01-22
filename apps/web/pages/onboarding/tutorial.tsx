import { OnboardingTutorialPage } from '@/src/pages/onboarding-tutorial';
import { createAuthenticatedLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = OnboardingTutorialPage;
Page.getLayout = createAuthenticatedLayout({ showFooter: false });

export default Page;
