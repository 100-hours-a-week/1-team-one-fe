import { Button } from '@repo/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';

import {
  type CharacterType,
  useCharacterSelectionMutation,
} from '@/src/features/character-selection';
import { onboardingStatusQueryOptions } from '@/src/features/onboarding-status';
import { isMobileUserAgent } from '@/src/shared/lib/device/user-agent';
import { ROUTES } from '@/src/shared/routes';
import { OptimizedImage } from '@/src/shared/ui/optimized-image';

import { CHARACTER_CARDS } from '../config/characters';
import { ONBOARDING_CHARACTER_MESSAGES } from '../config/messages';
import { Folder } from './Folder';

const { TITLE, SUBTITLE, IMAGE_ALT_SUFFIX, CTA_NEXT, QUESTION_MARK } =
  ONBOARDING_CHARACTER_MESSAGES;

export function OnboardingCharacterPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<CharacterType | null>(null);
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const onboardingStatusQueryKey = onboardingStatusQueryOptions().queryKey;
  const {
    mutate: characterMutate,
    isPending,
    isSuccess,
  } = useCharacterSelectionMutation({
    onSuccess: async () => {
      queryClient.setQueryData(onboardingStatusQueryKey, 'completed');

      //동기화도 진행
      void queryClient.refetchQueries({
        queryKey: onboardingStatusQueryKey,
        type: 'all',
      });
    },
  });

  const selectedIndex = selectedType
    ? CHARACTER_CARDS.findIndex((card) => card.type === selectedType)
    : -1;
  const resolvedSelectedIndex = selectedIndex >= 0 ? selectedIndex : null;
  const isSubmitting = isPending || isSuccess;

  const handleSelect = (index: number) => {
    if (isSubmitting) {
      return;
    }

    const card = CHARACTER_CARDS[index];

    if (!card) {
      return;
    }

    setSelectedType(card.type);
    setIsFolderOpen(true);

    characterMutate({ type: card.type });
  };

  const handleGoToApp = () => {
    if (typeof navigator !== 'undefined') {
      const isMobile = isMobileUserAgent(navigator.userAgent);
      if (isMobile) {
        void router.push(ROUTES.ONBOARDING_PWA_GUIDE);
        return;
      }
    }

    void router.push(ROUTES.MAIN);
  };

  const folderItems = CHARACTER_CARDS.map((card) => {
    const isSelected = card.type === selectedType;

    if (!isSelected) {
      return (
        <div
          key={card.type}
          className="border-brand-200 bg-brand-50 text-brand-700 flex h-10 w-10 items-center justify-center rounded-full border text-lg font-semibold"
        >
          {QUESTION_MARK}
        </div>
      );
    }

    return (
      <div
        key={card.type}
        className="text-text relative flex h-80 w-80 flex-col items-center gap-1"
      >
        <OptimizedImage
          src={card.imageSrc}
          alt={`${card.name} ${IMAGE_ALT_SUFFIX}`}
          width={220}
          height={220}
        />
        <span className="mt-10 text-xl font-semibold">{card.name}</span>
        {isSelected && (
          <span className="text-text-muted text-md whitespace-pre-wrap">{card.description}</span>
        )}
      </div>
    );
  });

  return (
    <div className="bg-bg text-text flex min-h-dvh flex-col items-center justify-evenly gap-4 px-6 py-8">
      <header className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-xl font-semibold">{TITLE}</h1>
        <p className="text-text-muted text-sm">{SUBTITLE}</p>
      </header>

      <section className="relative w-full max-w-md">
        <div className="inset-x-0 z-0 flex justify-center">
          <Folder
            size="lg"
            isOpen={isFolderOpen || Boolean(selectedType)}
            onToggle={setIsFolderOpen}
            enableToggle={!selectedType}
            items={folderItems}
            onItemSelect={handleSelect}
            selectedIndex={resolvedSelectedIndex}
          />
        </div>
        <div className="pt-56" />
      </section>

      <Button variant="primary" size="lg" fullWidth onClick={handleGoToApp} disabled={!isSuccess}>
        {isSuccess ? CTA_NEXT : '폴더 눌러 캐릭터 선택해주세요'}
      </Button>
    </div>
  );
}
