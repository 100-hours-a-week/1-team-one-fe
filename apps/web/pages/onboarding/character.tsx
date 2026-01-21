import { OnboardingCharacterPage } from '@/src/pages/onboarding';
import { createPublicLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = OnboardingCharacterPage;
Page.getLayout = createPublicLayout();

export default Page;
