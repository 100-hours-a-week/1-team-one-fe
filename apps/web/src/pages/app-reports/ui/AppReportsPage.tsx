import { ScrollTopButton } from '@/src/shared/ui/scroll-top-button';
import { ReportsListSection } from '@/src/widgets/reports-list';

import { APP_REPORTS_PAGE_MESSAGES } from '../config/messages';

export function AppReportsPage() {
  return (
    <div className="flex flex-col">
      <ReportsListSection />
      <ScrollTopButton ariaLabel={APP_REPORTS_PAGE_MESSAGES.ACTIONS.SCROLL_TOP} />
    </div>
  );
}
