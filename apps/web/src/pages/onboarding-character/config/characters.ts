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
    description: '꾸준함으로 성장하는 타입',
    imageSrc: '/icons/logo-without-bg.svg',
  },
  {
    type: 'JAY',
    name: '제이',
    description: '집중력이 높은 탐험가 타입',
    imageSrc: '/icons/logo-without-bg.svg',
  },
  {
    type: 'CHARLIE',
    name: '찰리',
    description: '분석과 설계를 좋아하는 타입',
    imageSrc: '/icons/logo-without-bg.svg',
  },
] as const;
