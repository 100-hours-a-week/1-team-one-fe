import { useEffect, useRef, useState } from 'react';

type UseCenterMyRankOnFirstRenderParams = {
  hasRows: boolean;
  myRankPosition: number | null;
  myRankUserId: number | null;
};

const MY_RANK_SELECTOR = '[data-leaderboard-my-rank="true"]';

/**
 * 최초 1회 내 순위를 중앙으로 스크롤
 */
export function useCenterMyRankOnFirstRender({
  hasRows,
  myRankPosition,
  myRankUserId,
}: UseCenterMyRankOnFirstRenderParams) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const hasCenteredMyRankRef = useRef(false);
  const [isCenteringMyRank, setIsCenteringMyRank] = useState(
    () => hasRows && Boolean(myRankUserId),
  );

  useEffect(() => {
    if (hasCenteredMyRankRef.current) return;
    if (!hasRows || !myRankUserId) {
      setIsCenteringMyRank(false);
      return;
    }

    const panelElement = panelRef.current;
    if (!panelElement) return;

    const myRankElement = panelElement.querySelector<HTMLElement>(MY_RANK_SELECTOR);
    if (!myRankElement) {
      if (myRankPosition !== null && myRankPosition <= 3) {
        hasCenteredMyRankRef.current = true;
        setIsCenteringMyRank(false);
      }
      return;
    }

    setIsCenteringMyRank(true);
    let timeoutId: number | null = null;

    const animationFrameId = window.requestAnimationFrame(() => {
      const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const scrollBehavior: ScrollBehavior = shouldReduceMotion ? 'auto' : 'smooth';

      myRankElement.scrollIntoView({
        block: 'center',
        inline: 'nearest',
        behavior: scrollBehavior,
      });
      hasCenteredMyRankRef.current = true;

      const settleDelayMs = scrollBehavior === 'smooth' ? 420 : 0;
      timeoutId = window.setTimeout(() => {
        setIsCenteringMyRank(false);
      }, settleDelayMs);
    });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [hasRows, myRankPosition, myRankUserId]);

  return {
    panelRef,
    isCenteringMyRank,
  };
}
