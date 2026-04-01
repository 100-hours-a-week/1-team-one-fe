import { createClient, type RedisClientType } from 'redis';

import { REDIS_CONFIG } from '@/src/shared/config/redis';

function createRedisClient(): RedisClientType {
  const client = createClient({
    RESP: 2,
    url: REDIS_CONFIG.URL,
    pingInterval: REDIS_CONFIG.PING_INTERVAL_MS,
    socket: {
      connectTimeout: REDIS_CONFIG.CONNECT_TIMEOUT_MS,
      reconnectStrategy: (retries) =>
        Math.min(
          retries * REDIS_CONFIG.RECONNECT_DELAY_STEP_MS,
          REDIS_CONFIG.RECONNECT_DELAY_MAX_MS,
        ),
    },
  });

  client.on('error', (error) => {
    if (!SHOULD_LOG_REDIS) return;
    console.warn('[redis] client_error', {
      error,
    });
  });

  return client;
}
type SharedRedisClient = RedisClientType;

type RedisGlobalState = typeof globalThis & {
  __raiseDeveloperRedisClient?: SharedRedisClient;
  __raiseDeveloperRedisConnectPromise?: Promise<SharedRedisClient>;
};

const globalRedisState = globalThis as RedisGlobalState;
const SHOULD_LOG_REDIS = process.env.NODE_ENV !== 'production';

export function isRedisEnabled() {
  return REDIS_CONFIG.URL.length > 0;
}

export async function getRedisClient(): Promise<SharedRedisClient | null> {
  if (!isRedisEnabled()) {
    return null;
  }

  const existingClient = globalRedisState.__raiseDeveloperRedisClient;
  if (existingClient?.isReady) {
    return existingClient;
  }

  const existingConnectPromise = globalRedisState.__raiseDeveloperRedisConnectPromise;
  if (existingConnectPromise) {
    return existingConnectPromise;
  }

  const client = existingClient ?? createRedisClient();
  globalRedisState.__raiseDeveloperRedisClient = client;

  const connectPromise = client
    .connect()
    .then(() => client)
    .catch((error: unknown) => {
      if (globalRedisState.__raiseDeveloperRedisClient === client) {
        globalRedisState.__raiseDeveloperRedisClient = undefined;
      }
      throw error;
    })
    .finally(() => {
      if (globalRedisState.__raiseDeveloperRedisConnectPromise === connectPromise) {
        globalRedisState.__raiseDeveloperRedisConnectPromise = undefined;
      }
    });

  globalRedisState.__raiseDeveloperRedisConnectPromise = connectPromise;
  return connectPromise;
}
