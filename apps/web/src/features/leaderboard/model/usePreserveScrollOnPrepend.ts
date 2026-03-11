import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';

type UsePreserveScrollOnPrependParams = {
  panelRef: RefObject<HTMLDivElement | null>;
  isFetchingPreviousPage: boolean;
  itemsLength: number;
};

type ElementScrollSnapshot = {
  kind: 'element';
  element: HTMLElement;
  scrollTop: number;
  scrollHeight: number;
};

type WindowScrollSnapshot = {
  kind: 'window';
  scrollTop: number;
  scrollHeight: number;
};

type ScrollSnapshot = ElementScrollSnapshot | WindowScrollSnapshot;

//overflow-y, 실제 높이로 스크롤 가능한 컨테이너인지 판별
function isScrollableElement(element: HTMLElement) {
  const { overflowY } = window.getComputedStyle(element);
  const supportsScroll = overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay';
  if (!supportsScroll) {
    return false;
  }

  return element.scrollHeight > element.clientHeight;
}

//패널 기준으로 부모를 순회해 실제 스크롤 컨테이너를 찾고, 없으면 window 스크롤을 사용
function resolveScrollContainer(panelElement: HTMLDivElement | null) {
  if (!panelElement) {
    return { kind: 'window' } as const;
  }

  let currentElement = panelElement.parentElement;
  while (currentElement) {
    if (isScrollableElement(currentElement)) {
      return { kind: 'element', element: currentElement } as const;
    }
    currentElement = currentElement.parentElement;
  }

  return { kind: 'window' } as const;
}

//window/document 호환 경로에서 현재 세로 스크롤 위치를 읽음
function getWindowScrollTop() {
  return window.scrollY || document.documentElement.scrollTop;
}

//prepend 이후 변화를 계산하기 위해 문서 전체 높이를 읽음
function getWindowScrollHeight() {
  return document.documentElement.scrollHeight;
}

/**
 * 이전 페이지 prepend 후 스크롤 점프 보정
 */
export function usePreserveScrollOnPrepend({
  panelRef,
  isFetchingPreviousPage,
  itemsLength,
}: UsePreserveScrollOnPrependParams) {
  const snapshotRef = useRef<ScrollSnapshot | null>(null);
  const [isRestoringPrependScroll, setIsRestoringPrependScroll] = useState(false);

  const captureSnapshotBeforePrepend = useCallback(() => {
    const scrollContainer = resolveScrollContainer(panelRef.current);
    if (scrollContainer.kind === 'element') {
      snapshotRef.current = {
        kind: 'element',
        element: scrollContainer.element,
        scrollTop: scrollContainer.element.scrollTop,
        scrollHeight: scrollContainer.element.scrollHeight,
      };
    } else {
      snapshotRef.current = {
        kind: 'window',
        scrollTop: getWindowScrollTop(),
        scrollHeight: getWindowScrollHeight(),
      };
    }

    setIsRestoringPrependScroll(true);
  }, [panelRef]);

  useEffect(() => {
    if (isFetchingPreviousPage) {
      return;
    }

    const snapshot = snapshotRef.current;
    if (!snapshot) {
      if (isRestoringPrependScroll) {
        setIsRestoringPrependScroll(false);
      }
      return;
    }

    const animationFrameId = window.requestAnimationFrame(() => {
      if (snapshot.kind === 'element') {
        const currentScrollHeight = snapshot.element.scrollHeight;
        const delta = currentScrollHeight - snapshot.scrollHeight;
        if (delta > 0) {
          snapshot.element.scrollTop = snapshot.scrollTop + delta;
        }
        snapshotRef.current = null;
        setIsRestoringPrependScroll(false);
        return;
      }

      const currentScrollHeight = getWindowScrollHeight();
      const delta = currentScrollHeight - snapshot.scrollHeight;
      if (delta > 0) {
        window.scrollTo({
          top: snapshot.scrollTop + delta,
          behavior: 'auto',
        });
      }
      snapshotRef.current = null;
      setIsRestoringPrependScroll(false);
    });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isFetchingPreviousPage, isRestoringPrependScroll, itemsLength]);

  return {
    captureSnapshotBeforePrepend,
    isRestoringPrependScroll,
  };
}
