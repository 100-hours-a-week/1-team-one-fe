import { OnboardingCharacterPage } from '@/src/pages/onboarding';
import { withPublicLayout } from '@/src/shared/lib/layout';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = OnboardingCharacterPage;
Page.getLayout = withPublicLayout;

export default Page;
