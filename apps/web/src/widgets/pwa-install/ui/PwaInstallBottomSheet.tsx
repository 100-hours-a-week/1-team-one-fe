import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetTitle,
} from '@repo/ui/bottom-sheet';
import { Button } from '@repo/ui/button';

import { PWA_INSTALL_MESSAGES } from '../config/messages';

const { SHEET } = PWA_INSTALL_MESSAGES;

interface PwaInstallBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isIos: boolean;
  isReady: boolean;
  canPromptInstall: boolean;
  onInstall: () => void | Promise<void>;
}

export function PwaInstallBottomSheet({
  open,
  onOpenChange,
  isIos,
  isReady,
  canPromptInstall,
  onInstall,
}: PwaInstallBottomSheetProps) {
  const stepsTitle = isIos ? SHEET.IOS_TITLE : SHEET.BROWSER_TITLE;
  const steps = isIos ? SHEET.IOS_STEPS : SHEET.BROWSER_STEPS;
  const showNonInstallableHint = !isIos && isReady && !canPromptInstall;

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent>
        <div className="flex flex-col gap-2">
          <BottomSheetTitle>{SHEET.TITLE}</BottomSheetTitle>
          <BottomSheetDescription>{SHEET.DESCRIPTION}</BottomSheetDescription>
        </div>

        <section className="mt-5 flex flex-col gap-3">
          <h2 className="text-text text-base font-semibold">{stepsTitle}</h2>
          <ol className="text-text-muted list-decimal space-y-2 pl-4 text-sm">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          {showNonInstallableHint && (
            <div className="bg-brand-50 text-brand-700 rounded-lg px-3 py-2 text-sm">
              <p className="font-semibold">{SHEET.NON_INSTALLABLE_TITLE}</p>
              <p className="mt-1">{SHEET.NON_INSTALLABLE_DESCRIPTION}</p>
            </div>
          )}
        </section>

        {canPromptInstall && !isIos && (
          <Button className="mt-6" size="lg" fullWidth onClick={onInstall}>
            {SHEET.CTA_INSTALL}
          </Button>
        )}
        <Button
          className={canPromptInstall && !isIos ? 'mt-3' : 'mt-6'}
          variant="secondary"
          size="lg"
          fullWidth
          onClick={() => onOpenChange(false)}
        >
          {SHEET.CTA_CONTINUE}
        </Button>
      </BottomSheetContent>
    </BottomSheet>
  );
}
