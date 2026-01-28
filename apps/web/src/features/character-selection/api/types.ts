import type { ApiResponse } from '@/src/shared/api';

export type CharacterType = 'KEVIN' | 'JAY' | 'CHARLIE';

export type CreateCharacterRequest = {
  type: CharacterType;
};

export type CreateCharacterData = {
  characterId: number;
};

export type CreateCharacterResponse = ApiResponse<CreateCharacterData>;

export type CompleteOnboardingResponse = ApiResponse<Record<string, never>>;
