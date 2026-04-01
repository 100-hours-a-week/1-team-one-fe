export const IMAGE_CONFIG = {
  DEFAULT_QUALITY: 85,
  DEFAULT_FILL_SIZES: '100vw',
  DEFAULT_DECODING: 'async',
  DEFAULT_PLACEHOLDER: 'empty',
  LCP_CANDIDATE_LOADING: 'eager',
  NON_LCP_LOADING: 'lazy',
  LCP_CANDIDATE_FETCH_PRIORITY: 'high',
  NON_LCP_FETCH_PRIORITY: 'low',
} as const;

export const IMAGE_LCP_CANDIDATE = {
  AUTO: 'auto',
  CANDIDATE: 'candidate',
  NON_CANDIDATE: 'non-candidate',
} as const;

export const IMAGE_LCP_LOAD_STRATEGY = {
  FETCH_PRIORITY: 'fetch-priority',
  PRELOAD: 'preload',
} as const;

export type ImageLcpCandidate = (typeof IMAGE_LCP_CANDIDATE)[keyof typeof IMAGE_LCP_CANDIDATE];

export type ImageLcpLoadStrategy =
  (typeof IMAGE_LCP_LOAD_STRATEGY)[keyof typeof IMAGE_LCP_LOAD_STRATEGY];
