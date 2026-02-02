import type { ReactNode } from 'react';

import { LOADING_CONFIG } from '@/src/shared/config/loading';
import { useDelayedValue } from '@/src/shared/lib/loading';

export interface LoadableBoundaryProps<TData> {
  isLoading: boolean; //초기데이터 로딩 여부
  isFetching?: boolean; //리페치 중인지
  error: Error | null | unknown; //에러 객체
  data: TData | undefined; //데이터
  isEmpty?: boolean; //빈 상태 여부

  renderLoading: () => ReactNode; //로딩 상태 렌더 함수
  renderError: (error: Error | unknown) => ReactNode; //에러 상태 렌더 함수
  renderWarning?: (error: Error | unknown) => ReactNode; //경고 상태 렌더 함수
  renderEmpty?: () => ReactNode; //빈 상태 렌더 함수
  children: (data: TData) => ReactNode; //성공 상태 렌더 함수

  skipDelay?: boolean; //로딩 딜레이 스킵?
}

/**
 * 로딩/에러/빈 상태 처리하는 공용 바운더리 컴포넌트
 * 딜레이 기반 스켈레톤 표시로 플리커 방지
 * keepPreviousData 지원 -> 리페치 실패 시 기존 데이터 유지
 */
export function LoadableBoundary<TData>({
  isLoading,
  isFetching = false,
  error,
  data,
  isEmpty = false,
  renderLoading,
  renderError,
  renderWarning,
  renderEmpty,
  children,
  skipDelay = false,
}: LoadableBoundaryProps<TData>) {
  const shouldShowLoading = useDelayedValue(
    isLoading,
    skipDelay ? 0 : LOADING_CONFIG.DEFAULT_DELAY,
  );
  const hasData = data !== undefined;
  const hasError = Boolean(error);
  const shouldRenderWarning = hasError && hasData && Boolean(renderWarning);

  //처리 우선순위: 에러 → 로딩 → 빈 상태 → 성공

  //데이터가 없을 때만 블로킹 에러 표시
  if (hasError && !hasData) {
    return <>{renderError(error)}</>;
  }

  //초기 로딩 시 스켈레톤 표시(딜레이 적용)
  if (isLoading && shouldShowLoading) {
    return (
      <div aria-busy="true" aria-label="Loading content">
        {renderLoading()}
      </div>
    );
  }

  //리페치 중 & 기존 데이터 있음 - 기존 데이터 유지(스켈레톤 없음)
  if (isFetching && hasData && !shouldRenderWarning) {
    return <>{children(data)}</>;
  }

  //데이터가 비었으면 빈 상태 표시
  if (isEmpty && renderEmpty) {
    return (
      <>
        {shouldRenderWarning ? renderWarning?.(error) : null}
        {renderEmpty()}
      </>
    );
  }

  //데이터 있으면 성공 상태
  if (hasData) {
    return (
      <>
        {shouldRenderWarning ? renderWarning?.(error) : null}
        {children(data)}
      </>
    );
  }

  //에러 표시
  if (hasError) {
    return <>{renderError(error)}</>;
  }

  return null;
}
