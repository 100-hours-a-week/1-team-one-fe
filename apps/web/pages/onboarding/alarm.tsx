import { OnboardingAlarmPage } from '@/src/pages/onboarding-alarm';
import { withAuthenticatedLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = OnboardingAlarmPage;
Page.getLayout = withAuthenticatedLayout;

export default Page;
