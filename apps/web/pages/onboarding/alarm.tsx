import { OnboardingAlarmPage } from '@/src/pages/onboarding-alarm';
import { createAuthenticatedLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = OnboardingAlarmPage;
Page.getLayout = createAuthenticatedLayout({ showFooter: false });

export default Page;
