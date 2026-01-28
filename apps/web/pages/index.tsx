import { SplashPage } from '@/src/pages/splash';
import type { NextPageWithLayout } from '@/src/shared/types';

const Page: NextPageWithLayout = SplashPage;
Page.getLayout = (page) => page;

export default Page;
