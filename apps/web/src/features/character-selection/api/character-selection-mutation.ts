import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { type ApiError, getHttpClient } from '@/src/shared/api';

import { CHARACTER_SELECTION_QUERY_KEYS } from '../config/query-keys';
import type {
  CompleteOnboardingResponse,
  CreateCharacterRequest,
  CreateCharacterResponse,
} from './types';

async function createCharacter(payload: CreateCharacterRequest): Promise<number> {
  const client = getHttpClient({ requiresAuth: true });
  const response = await client.post<CreateCharacterResponse>('/users/me/character', payload);

  return response.data.data.characterId;
}

async function completeOnboarding(): Promise<void> {
  const client = getHttpClient({ requiresAuth: true });
  await client.post<CompleteOnboardingResponse>('/users/me/onboarding-completed');
}

async function submitCharacterSelection(payload: CreateCharacterRequest): Promise<number> {
  const characterId = await createCharacter(payload);
  await completeOnboarding();

  return characterId;
}

export type CharacterSelectionMutationOptions = Omit<
  UseMutationOptions<number, ApiError, CreateCharacterRequest>,
  'mutationFn'
>;

export function useCharacterSelectionMutation(options?: CharacterSelectionMutationOptions) {
  return useMutation({
    mutationKey: CHARACTER_SELECTION_QUERY_KEYS.select(),
    mutationFn: submitCharacterSelection,
    ...options,
  });
}
