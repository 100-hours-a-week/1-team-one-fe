import { createHash, randomUUID } from 'node:crypto';

import { BFF_REDIS_CONFIG } from '@/src/shared/config/bff';
import { getRedisClient, isRedisEnabled } from '@/src/shared/lib/redis/client';

import type {
  DistributedRefreshTokensResult,
  SharedRefreshResult,
} from './refresh-single-flight.types';
import { isTokens } from './refresh-single-flight.types';
import { isRecord, refreshTokens } from './token';
import type { RefreshTokensResult } from './types';

//안전하게 unlock 하기 위해 루아 스크립트 사용
const RELEASE_LOCK_SCRIPT = `
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
else
  return 0
end
`;

const SHOULD_LOG_REFRESH = process.env.NODE_ENV !== 'production';

function logRefreshCoordinator(event: string, detail?: Readonly<Record<string, unknown>>) {
  if (!SHOULD_LOG_REFRESH) return;

  console.info('[bff-refresh-coordinator]', {
    event,
    ...detail,
  });
}

//baseUrl + refreshToken 을 sha256 해시
function createRefreshKey(baseUrl: string, refreshToken: string) {
  return createHash('sha256').update(`${baseUrl}:${refreshToken}`).digest('hex');
}

//redis prefix 설정
function createLockKey(refreshKey: string) {
  return `lock:bff:refresh:${refreshKey}`;
}

function createResultKey(refreshKey: string) {
  return `result:bff:refresh:${refreshKey}`;
}

function createSharedRefreshResult(result: RefreshTokensResult): SharedRefreshResult {
  return {
    ...result,
    createdAt: Date.now(),
  };
}

function parseSharedRefreshResult(value: string): RefreshTokensResult | null {
  let parsed: unknown;

  try {
    parsed = JSON.parse(value) as unknown;
  } catch {
    return null;
  }

  if (!isRecord(parsed)) return null;
  if (typeof parsed.status !== 'number') return null;
  if (typeof parsed.createdAt !== 'number') return null;
  if (parsed.payload !== null && !isRecord(parsed.payload)) return null;
  if (parsed.tokens !== null && !isTokens(parsed.tokens)) return null;

  return {
    status: parsed.status,
    tokens: parsed.tokens,
    payload: parsed.payload,
  };
}

function sleep(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function readSharedRefreshResult(resultKey: string) {
  const redis = await getRedisClient();
  if (!redis) return null;

  const value = await redis.get(resultKey);
  if (!value) return null;

  return parseSharedRefreshResult(value);
}

async function tryAcquireRefreshLock(lockKey: string, ownerToken: string) {
  const redis = await getRedisClient();
  if (!redis) return false;

  //키가 없을 때만, 만료 시간까지 같이 걸어서 저장
  //동시에 SET NX PX 호출
  const result = await redis.set(lockKey, ownerToken, {
    expiration: {
      type: 'PX',
      value: BFF_REDIS_CONFIG.REFRESH_LOCK_TTL_MS,
    }, //민료 시점 설정
    condition: 'NX', //키가 없을 때만
  });

  return result === 'OK';
}

async function publishSharedRefreshResult(resultKey: string, result: RefreshTokensResult) {
  const redis = await getRedisClient();
  if (!redis) return;

  await redis.set(resultKey, JSON.stringify(createSharedRefreshResult(result)), {
    expiration: {
      type: 'PX',
      value: BFF_REDIS_CONFIG.REFRESH_RESULT_TTL_MS,
    },
  });
}

//락 해제
async function releaseRefreshLock(lockKey: string, ownerToken: string) {
  const redis = await getRedisClient();
  if (!redis) return;

  await redis.eval(RELEASE_LOCK_SCRIPT, {
    keys: [lockKey],
    arguments: [ownerToken],
  });
}

//polling 방식으로 구현
async function waitForSharedRefreshResult(resultKey: string) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < BFF_REDIS_CONFIG.REFRESH_WAIT_TIMEOUT_MS) {
    const sharedRefreshResult = await readSharedRefreshResult(resultKey);
    if (sharedRefreshResult) {
      return sharedRefreshResult;
    }

    const jitter = Math.floor(Math.random() * BFF_REDIS_CONFIG.REFRESH_POLL_JITTER_MS);
    await sleep(BFF_REDIS_CONFIG.REFRESH_POLL_INTERVAL_MS + jitter);
  }

  return null;
}

//leader 작업 -> 실제 refreshTokens 호출
async function runLeaderRefresh(
  baseUrl: string,
  refreshToken: string,
  lockKey: string,
  resultKey: string,
  ownerToken: string,
): Promise<DistributedRefreshTokensResult> {
  try {
    const refreshResult = await refreshTokens(baseUrl, refreshToken);

    try {
      await publishSharedRefreshResult(resultKey, refreshResult);
    } catch (error) {
      logRefreshCoordinator('shared_result_publish_failed', {
        error,
        resultKey,
      });
    }

    logRefreshCoordinator('leader_completed', {
      lockKey,
      resultKey,
      status: refreshResult.status,
      hasTokens: refreshResult.tokens !== null,
    });

    return {
      ...refreshResult,
      source: 'leader',
    };
  } finally {
    try {
      await releaseRefreshLock(lockKey, ownerToken);
    } catch (error) {
      logRefreshCoordinator('lock_release_failed', {
        error,
        lockKey,
      });
    }
  }
}

export async function refreshTokensDistributedSingleFlight({
  baseUrl,
  refreshToken,
}: {
  baseUrl: string;
  refreshToken: string;
}): Promise<DistributedRefreshTokensResult> {
  if (!isRedisEnabled()) {
    const fallbackResult = await refreshTokens(baseUrl, refreshToken);
    return {
      ...fallbackResult,
      source: 'fallback',
    };
  }

  const refreshKey = createRefreshKey(baseUrl, refreshToken);
  const lockKey = createLockKey(refreshKey);
  const resultKey = createResultKey(refreshKey);
  const ownerToken = randomUUID();

  try {
    const sharedRefreshResult = await readSharedRefreshResult(resultKey);
    if (sharedRefreshResult) {
      logRefreshCoordinator('shared_result_hit', {
        resultKey,
      });

      return {
        ...sharedRefreshResult,
        source: 'shared-result',
      };
    }

    const isLeader = await tryAcquireRefreshLock(lockKey, ownerToken);
    if (isLeader) {
      logRefreshCoordinator('lock_acquired', {
        lockKey,
      });

      return runLeaderRefresh(baseUrl, refreshToken, lockKey, resultKey, ownerToken);
    }

    logRefreshCoordinator('lock_wait', {
      lockKey,
    });

    //follower 인 경우
    const waitedResult = await waitForSharedRefreshResult(resultKey);
    if (waitedResult) {
      return {
        ...waitedResult,
        source: 'shared-result',
      };
    }

    const retryLeader = await tryAcquireRefreshLock(lockKey, ownerToken);
    if (retryLeader) {
      logRefreshCoordinator('lock_reacquired_after_wait', {
        lockKey,
      });

      return runLeaderRefresh(baseUrl, refreshToken, lockKey, resultKey, ownerToken);
    }

    logRefreshCoordinator('wait_timeout_fallback', {
      lockKey,
      resultKey,
    });

    const fallbackResult = await refreshTokens(baseUrl, refreshToken);
    return {
      ...fallbackResult,
      source: 'fallback',
    };
  } catch (error) {
    logRefreshCoordinator('redis_coordinator_failed', {
      error,
      lockKey,
      resultKey,
    });

    const fallbackResult = await refreshTokens(baseUrl, refreshToken);
    return {
      ...fallbackResult,
      source: 'fallback',
    };
  }
}
