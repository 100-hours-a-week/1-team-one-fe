import { render, screen } from '@testing-library/react';

import type { LeaderboardRankItemType } from '@/src/entities/leaderboard';

import { LeaderboardPodiumItem } from './LeaderboardPodiumItem';
import { LeaderboardRankRow } from './LeaderboardRankPanelItem';

jest.mock('@repo/ui/avatar', () => ({
  Avatar: ({ alt, name, src }: { alt?: string; name?: string; src?: string | null }) => (
    <div
      data-testid="avatar"
      data-alt={alt ?? name ?? 'avatar'}
      data-src={src ?? undefined}
      role="img"
      aria-label={alt ?? name ?? 'avatar'}
    />
  ),
}));

jest.mock('@/src/shared/ui/optimized-image', () => ({
  OptimizedImage: () => null,
}));

const TEST_BASE_URL = 'https://raisedeveloper.com';

const TEST_ITEM: LeaderboardRankItemType = {
  rank: 4,
  userId: 101,
  nickname: '테스트유저',
  profileImageUrl: 'users/profile/11ee00be-a349-4d1d-b702-a30c9043e09d.png',
  level: 8,
  exp: 12345,
  statusScore: 12,
  streak: 3,
};

describe('leaderboard avatar src', () => {
  const originalGcsBaseUrl = process.env.NEXT_PUBLIC_GCS_BASE_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_GCS_BASE_URL = TEST_BASE_URL;
  });

  afterAll(() => {
    if (originalGcsBaseUrl) {
      process.env.NEXT_PUBLIC_GCS_BASE_URL = originalGcsBaseUrl;
      return;
    }

    delete process.env.NEXT_PUBLIC_GCS_BASE_URL;
  });

  it('rank row avatar는 backend relative path를 절대 URL로 변환해야 한다.', () => {
    render(<LeaderboardRankRow item={TEST_ITEM} isMyRank={false} totalCount={100} />);

    expect(screen.getByRole('img', { name: '테스트유저 프로필 이미지' })).toHaveAttribute(
      'data-src',
      'https://raisedeveloper.com/users/profile/11ee00be-a349-4d1d-b702-a30c9043e09d.png',
    );
  });

  it('podium avatar는 backend relative path를 절대 URL로 변환해야 한다.', () => {
    render(<LeaderboardPodiumItem rank={1} item={TEST_ITEM} />);

    expect(screen.getByRole('img', { name: '테스트유저 프로필 이미지' })).toHaveAttribute(
      'data-src',
      'https://raisedeveloper.com/users/profile/11ee00be-a349-4d1d-b702-a30c9043e09d.png',
    );
  });
});
