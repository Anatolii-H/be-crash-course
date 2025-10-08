import { Redis } from 'ioredis';
import { TCommentEvent } from 'src/types/services/IRedisEvents';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let redisClient: Redis | null = null;

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
