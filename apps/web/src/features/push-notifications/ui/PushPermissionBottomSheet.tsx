import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetTitle,
} from '@repo/ui/bottom-sheet';
import { Button } from '@repo/ui/button';

import { PUSH_PERMISSION_MESSAGES } from '../config/messages';
import type { PushPermissionPlatform } from '../lib/permission-platform';

const { SHEET, DENIED_GUIDE } = PUSH_PERMISSION_MESSAGES;

interface PushPermissionBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permission: NotificationPermission;
  platform: PushPermissionPlatform;
  isRequesting: boolean;
  onRequestPermission: () => void | Promise<void>;
}

export function PushPermissionBottomSheet({
  open,
  onOpenChange,
  permission,
  platform,
  isRequesting,
  onRequestPermission,
}: PushPermissionBottomSheetProps) {
  const description =
    permission === 'denied' ? SHEET.DESCRIPTION_DENIED : SHEET.DESCRIPTION_DEFAULT;
  const showDeniedGuide = permission === 'denied';
  const guideSteps = (() => {
    if (platform === 'ios') return DENIED_GUIDE.IOS_STEPS;
    if (platform === 'android') return DENIED_GUIDE.ANDROID_STEPS;
    return DENIED_GUIDE.DESKTOP_STEPS;
  })();

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent>
        <div className="flex flex-col gap-2">
          <BottomSheetTitle>{SHEET.TITLE}</BottomSheetTitle>
          <BottomSheetDescription>{description}</BottomSheetDescription>
        </div>

        {showDeniedGuide && (
          <section className="mt-5 flex flex-col gap-3">
            <h2 className="text-text text-base font-semibold">{DENIED_GUIDE.TITLE}</h2>
            <ol className="text-text-muted list-decimal space-y-2 pl-4 text-sm">
              {guideSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        )}

        <Button
          className="mt-6"
          size="lg"
          fullWidth
          onClick={onRequestPermission}
          disabled={isRequesting}
        >
          {SHEET.CTA_REQUEST}
        </Button>
        <Button
          className="mt-3"
          variant="secondary"
          size="lg"
          fullWidth
          onClick={() => onOpenChange(false)}
        >
          {SHEET.CTA_CLOSE}
        </Button>
      </BottomSheetContent>
    </BottomSheet>
  );
}
