import { Button } from '@repo/ui/button';
import {
  ConfirmDialog,
  ConfirmDialogClose,
  ConfirmDialogContent,
  ConfirmDialogDescription,
  ConfirmDialogFooter,
  ConfirmDialogHeader,
  ConfirmDialogTitle,
  ConfirmDialogTrigger,
} from '@repo/ui/confirm-dialog';
import Image from 'next/image';

import type { UserCharacter } from '@/src/features/user-profile';

import {
  CHARACTER_STATUS,
  getCharacterImagePath,
  getCharacterStatusByScore,
} from '../config/character-status';
import { APP_MAIN_MESSAGES } from '../config/messages';

type AppMainCharacterSectionProps = {
  characterName: string;
  characterType: UserCharacter['type'];
  statusScore: number;
};

export function AppMainCharacterSection({
  characterName,
  characterType,
  statusScore,
}: AppMainCharacterSectionProps) {
  const characterStatus = getCharacterStatusByScore(statusScore);
  const characterImage = getCharacterImagePath(
    { type: characterType },
    characterStatus ?? CHARACTER_STATUS.NORMAL,
  );

  return (
    <section className="flex flex-col items-center justify-center px-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-text text-sm font-semibold">
          {APP_MAIN_MESSAGES.STATUS_SCORE.LABEL}
        </span>
        <span className="text-text text-sm font-semibold tabular-nums">{statusScore}</span>
        <ConfirmDialog>
          <ConfirmDialogTrigger asChild>
            <button
              type="button"
              aria-label={APP_MAIN_MESSAGES.STATUS_SCORE.BADGE_ARIA_LABEL}
              className="border-border text-text-muted hover:text-text flex h-5 w-5 items-center justify-center rounded-full border text-xs font-semibold"
            >
              ?
            </button>
          </ConfirmDialogTrigger>
          <ConfirmDialogContent>
            <ConfirmDialogHeader>
              <ConfirmDialogTitle>{APP_MAIN_MESSAGES.STATUS_SCORE.GUIDE_TITLE}</ConfirmDialogTitle>
              <ConfirmDialogDescription>
                {APP_MAIN_MESSAGES.STATUS_SCORE.GUIDE_DESCRIPTION}
              </ConfirmDialogDescription>
            </ConfirmDialogHeader>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-text-muted">
                  {APP_MAIN_MESSAGES.STATUS_SCORE.GUIDE_ITEMS.DYING.RANGE}
                </span>
                <span className="text-text font-semibold">
                  {APP_MAIN_MESSAGES.STATUS_SCORE.GUIDE_ITEMS.DYING.LABEL}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-text-muted">
                  {APP_MAIN_MESSAGES.STATUS_SCORE.GUIDE_ITEMS.HUNGRY_WEAK.RANGE}
                </span>
                <span className="text-text font-semibold">
                  {APP_MAIN_MESSAGES.STATUS_SCORE.GUIDE_ITEMS.HUNGRY_WEAK.LABEL}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-text-muted">
                  {APP_MAIN_MESSAGES.STATUS_SCORE.GUIDE_ITEMS.NORMAL.RANGE}
                </span>
                <span className="text-text font-semibold">
                  {APP_MAIN_MESSAGES.STATUS_SCORE.GUIDE_ITEMS.NORMAL.LABEL}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-text-muted">
                  {APP_MAIN_MESSAGES.STATUS_SCORE.GUIDE_ITEMS.HEALTHY.RANGE}
                </span>
                <span className="text-text font-semibold">
                  {APP_MAIN_MESSAGES.STATUS_SCORE.GUIDE_ITEMS.HEALTHY.LABEL}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-text-muted">
                  {APP_MAIN_MESSAGES.STATUS_SCORE.GUIDE_ITEMS.SUPER_HEALTHY.RANGE}
                </span>
                <span className="text-text font-semibold">
                  {APP_MAIN_MESSAGES.STATUS_SCORE.GUIDE_ITEMS.SUPER_HEALTHY.LABEL}
                </span>
              </div>
            </div>
            <ConfirmDialogFooter>
              <ConfirmDialogClose asChild>
                <Button variant="primary" fullWidth>
                  {APP_MAIN_MESSAGES.STATUS_SCORE.GUIDE_CLOSE}
                </Button>
              </ConfirmDialogClose>
            </ConfirmDialogFooter>
          </ConfirmDialogContent>
        </ConfirmDialog>
      </div>
      <Image
        src={characterImage}
        alt={APP_MAIN_MESSAGES.CHARACTER_IMAGE_ALT}
        width={400}
        height={300}
      />
      <p className="text-xl font-semibold">{characterName}</p>
    </section>
  );
}
