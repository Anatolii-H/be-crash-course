import 'src/services/env/env.service';

import { Server } from 'socket.io';
import { Redis } from 'ioredis';
import { createAdapter } from '@socket.io/redis-adapter';

import { initializeRedisEvents, registerSocketEventsHandler } from './events';
import { authMiddleware } from './auth';

const WS_PORT = Number(process.env.WS_PORT);
const REDIS_URL = process.env.REDIS_URL;

async function bootstrap() {
  const pubClient = new Redis(REDIS_URL);
  const subClient = pubClient.duplicate();

  const io = new Server({
    cors: { origin: true },
    adapter: createAdapter(pubClient, subClient)
  });

  io.use(authMiddleware);
  io.on('connection', registerSocketEventsHandler);

  await initializeRedisEvents(io, subClient);

  io.listen(WS_PORT);

  console.log(`WebSocket server listening on port ${WS_PORT}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start WebSocket server:', error);

  process.exit(1);
});
