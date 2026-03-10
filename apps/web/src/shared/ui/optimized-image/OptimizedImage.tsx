import Image, { type ImageProps } from 'next/image';
import { useEffect } from 'react';

import {
  IMAGE_CONFIG,
  IMAGE_LCP_CANDIDATE,
  IMAGE_LCP_LOAD_STRATEGY,
  type ImageLcpCandidate,
  type ImageLcpLoadStrategy,
} from '@/src/shared/config/image';
import { buildImageUrl } from '@/src/shared/lib/image';

type LcpAwareImageProps = Pick<ImageProps, 'loading' | 'fetchPriority' | 'preload'>;

function shouldSkipBuildImageUrl(src: string): boolean {
  return (
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('data:') ||
    src.startsWith('blob:')
  );
}

function resolveImageSrc(src: ImageProps['src'], srcBaseUrl?: string): ImageProps['src'] {
  if (typeof src !== 'string') return src;
  if (shouldSkipBuildImageUrl(src)) return src;
  return buildImageUrl(src, srcBaseUrl);
}

/**
 * LCP 후보 여부와 전략에 따라 `loading` / `fetchPriority` / `preload`를 안전하게 계산한다.
 *
 * 정책:
 * - preload가 명시되면 preload를 우선 적용하고 나머지 우선순위 힌트는 제거
 * - LCP 후보 + preload 전략이면 preload 사용
 * - LCP 후보 + fetch-priority 전략이면 eager + high 적용
 * - 비후보면 lazy + low 기본 적용
 */
function resolveLcpAwareProps({
  loading,
  fetchPriority,
  preload,
  lcpCandidate,
  lcpLoadStrategy,
}: LcpAwareImageProps & {
  lcpCandidate: ImageLcpCandidate;
  lcpLoadStrategy: ImageLcpLoadStrategy;
}): Pick<ImageProps, 'loading' | 'fetchPriority' | 'preload'> {
  if (preload === true) {
    return {
      loading: undefined,
      fetchPriority: undefined,
      preload: true,
    };
  }

  if (
    lcpCandidate === IMAGE_LCP_CANDIDATE.CANDIDATE &&
    lcpLoadStrategy === IMAGE_LCP_LOAD_STRATEGY.PRELOAD
  ) {
    return {
      loading: undefined,
      fetchPriority: undefined,
      preload: true,
    };
  }

  if (lcpCandidate === IMAGE_LCP_CANDIDATE.CANDIDATE) {
    return {
      loading: IMAGE_CONFIG.LCP_CANDIDATE_LOADING,
      fetchPriority: IMAGE_CONFIG.LCP_CANDIDATE_FETCH_PRIORITY,
      preload: false,
    };
  }

  if (lcpCandidate === IMAGE_LCP_CANDIDATE.NON_CANDIDATE) {
    return {
      loading: loading ?? IMAGE_CONFIG.NON_LCP_LOADING,
      fetchPriority: fetchPriority ?? IMAGE_CONFIG.NON_LCP_FETCH_PRIORITY,
      preload: false,
    };
  }

  return {
    loading,
    fetchPriority,
    preload: false,
  };
}

export type OptimizedImageProps = Omit<ImageProps, 'priority'> & {
  /** LCP 후보 여부 (`candidate` | `non-candidate` | `auto`) */
  lcpCandidate?: ImageLcpCandidate;
  /** LCP 후보일 때 적용할 전략 (`fetch-priority` | `preload`) */
  lcpLoadStrategy?: ImageLcpLoadStrategy;
  /** 기본 이미지 base URL을 강제로 지정할 때 사용 */
  srcBaseUrl?: string;
};

/**
 * `next/image` 공통 래퍼.
 *
 * 기능:
 * - 품질/디코딩/placeholder/sizes 기본값 통일
 * - LCP 후보 정책을 prop 기반으로 일관 적용
 * - `blurDataURL` 없는 `placeholder="blur"`를 안전하게 `empty`로 보정
 */
export function OptimizedImage({
  src,
  quality = IMAGE_CONFIG.DEFAULT_QUALITY,
  decoding = IMAGE_CONFIG.DEFAULT_DECODING,
  placeholder,
  sizes,
  fill,
  blurDataURL,
  loading,
  fetchPriority,
  preload,
  lcpCandidate = IMAGE_LCP_CANDIDATE.AUTO,
  lcpLoadStrategy = IMAGE_LCP_LOAD_STRATEGY.FETCH_PRIORITY,
  srcBaseUrl = process.env.NEXT_PUBLIC_GCS_BASE_URL,
  ...props
}: OptimizedImageProps) {
  const resolvedSrc = resolveImageSrc(src, srcBaseUrl);

  useEffect(() => {
    console.log(resolvedSrc);
  }, [resolvedSrc]);
  const hasBlurDataURL = typeof blurDataURL === 'string' && blurDataURL.length > 0;
  const blurPlaceholder = hasBlurDataURL ? (placeholder ?? 'blur') : placeholder;
  const resolvedPlaceholder =
    blurPlaceholder === 'blur' && !hasBlurDataURL
      ? IMAGE_CONFIG.DEFAULT_PLACEHOLDER
      : (blurPlaceholder ?? IMAGE_CONFIG.DEFAULT_PLACEHOLDER);
  const resolvedSizes = fill ? (sizes ?? IMAGE_CONFIG.DEFAULT_FILL_SIZES) : sizes;

  const lcpAwareProps = resolveLcpAwareProps({
    loading,
    fetchPriority,
    preload,
    lcpCandidate,
    lcpLoadStrategy,
  });

  return (
    <Image
      src={resolvedSrc}
      quality={quality}
      decoding={decoding}
      placeholder={resolvedPlaceholder}
      sizes={resolvedSizes}
      fill={fill}
      blurDataURL={blurDataURL}
      {...lcpAwareProps}
      {...props}
    />
  );
}
