import type { CharacterType } from '@/src/features/character-selection';

export type CharacterCard = {
  type: CharacterType;
  name: string;
  description: string;
  imageSrc: string;
};

export const CHARACTER_CARDS: CharacterCard[] = [
  {
    type: 'KEVIN',
    name: '케빈',
    description: `꾸준함으로\n성장하는 타입`,
    imageSrc: '/character/kevin/normal.png',
  },
  {
    type: 'JAY',
    name: '제이',
    description: `집중력이 높은\n탐험가 타입`,
    imageSrc: '/character/jay/normal.png',
  },
  {
    type: 'CHARLIE',
    name: '찰리',
    description: `분석과 설계를\n좋아하는 타입`,
    imageSrc: '/character/charlie/normal.png',
  },
] as const;
