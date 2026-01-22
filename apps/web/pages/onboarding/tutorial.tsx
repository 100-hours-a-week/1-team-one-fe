import { OnboardingTutorialPage } from '@/src/pages/onboarding-tutorial';
import { withAuthenticatedLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = OnboardingTutorialPage;
Page.getLayout = withAuthenticatedLayout;

export default Page;
