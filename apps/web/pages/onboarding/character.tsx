import { OnboardingCharacterPage } from '@/src/pages/onboarding-character';
import { createAuthenticatedLayout } from '@/src/shared/lib/layout/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = OnboardingCharacterPage;
Page.getLayout = createAuthenticatedLayout({ showFooter: false });

export default Page;
