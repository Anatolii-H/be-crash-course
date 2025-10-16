/* eslint-disable max-len */
import { Redis } from 'ioredis';
import { TCommentEvent } from 'src/types/services/IRedisEvents';

// WEBSOCKET: Підключати редіс краще через REDIS_HOST та REDIS_PORT. 
// Це дає тобі можливість додати додаткові опції при підключенні.

// WEBSOCKET: Зараз ти вже маєш REDIS_PORT, але не використовуєш його, бо в тебе є REDIS_URL який вже має захардкодений port.
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let redisClient: Redis | null = null;

// WEBSOCKET: В тебе 2 рази запускається редіс. Це не зручно, так як треба 2 місцях прописувати конфіг. 
// Краще це зробити підключення 1 раз.
export function getRedisPublisher(): Redis {
  if (!redisClient) {
    redisClient = new Redis(REDIS_URL);

    redisClient.on('error', (err) => {
      console.error('Redis publisher error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Redis publisher connected');
    });
  }

  return redisClient;
}

export async function publishCommentEvent(payload: TCommentEvent) {
  const redis = getRedisPublisher();

  await redis.publish('comments:events', JSON.stringify(payload));
}
