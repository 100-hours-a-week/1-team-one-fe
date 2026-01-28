import { Button } from '@repo/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';

import {
  type CharacterType,
  useCharacterSelectionMutation,
} from '@/src/features/character-selection';
import { ONBOARDING_STATUS_QUERY_KEYS } from '@/src/features/onboarding-status/config/query-keys';
import { isApiError } from '@/src/shared/api';
import { isMobileUserAgent } from '@/src/shared/lib/device/user-agent';
import { ROUTES } from '@/src/shared/routes';

import { CHARACTER_CARDS } from '../config/characters';
import { ONBOARDING_CHARACTER_MESSAGES } from '../config/messages';
import { Folder } from './Folder';

const {
  TITLE,
  SUBTITLE,
  ERROR_ALREADY_SET,
  ERROR_UNKNOWN,
  IMAGE_ALT_SUFFIX,
  CTA_NEXT,
  QUESTION_MARK,
} = ONBOARDING_CHARACTER_MESSAGES;

export function OnboardingCharacterPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<CharacterType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const {
    mutate: characterMutate,
    isPending,
    isSuccess,
  } = useCharacterSelectionMutation({
    onSuccess: async () => {
      queryClient.setQueryData(ONBOARDING_STATUS_QUERY_KEYS.onboardingStatus(), (prev: any) => ({
        ...prev,
        onboardingCompleted: true,
      }));

      //동기화도 진행
      void queryClient.invalidateQueries({
        queryKey: ONBOARDING_STATUS_QUERY_KEYS.onboardingStatus(),
      });
    },

    onError: (error) => {
      if (isApiError(error) && error.code === 'CHARACTER_ALREADY_SET') {
        setErrorMessage(ERROR_ALREADY_SET);
        return;
      }

      setErrorMessage(ERROR_UNKNOWN);
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
    setErrorMessage(null);
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
      <div key={card.type} className="text-text flex flex-col items-center gap-1">
        <img src={card.imageSrc} alt={`${card.name} ${IMAGE_ALT_SUFFIX}`} className="h-60 w-auto" />
        <span className="text-xl font-semibold">{card.name}</span>
        {isSelected && <span className="text-text-muted text-md">{card.description}</span>}
      </div>
    );
  });

  return (
    <div className="bg-bg text-text flex min-h-dvh flex-col items-center justify-between gap-6 px-6 py-8">
      <header className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-xl font-semibold">{TITLE}</h1>
        <p className="text-text-muted text-sm">{SUBTITLE}</p>
      </header>

      {errorMessage && (
        <div className="bg-error-50 text-error-700 border-error-200 w-full max-w-md rounded-lg border px-4 py-3 text-sm">
          <p role="alert">{errorMessage}</p>
        </div>
      )}

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

      {/* {isSuccess && ( */}
      <Button variant="primary" size="lg" fullWidth onClick={handleGoToApp}>
        {CTA_NEXT}
      </Button>
      {/* )} */}
    </div>
  );
}
