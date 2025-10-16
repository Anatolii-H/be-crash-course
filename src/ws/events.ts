import { Socket, Server } from 'socket.io';
import Redis from 'ioredis';

import { TCommentEvent } from 'src/types/services/IRedisEvents';

export function registerSocketEventsHandler(socket: Socket) {
  socket.on('subscribe', (payload: { postId: string }) => {
    if (!payload?.postId) {
      return;
    }

    // WEBSOCKET: Треба додати перевірку чи такий пост взагалі існує в твоїй базі даних.
    // Якщо немає, то не треба робити join room.

    const room = `post:${payload.postId}`;

    socket.join(room);
    socket.emit('subscribed', { postId: payload.postId });
  });

  socket.on('unsubscribe', (payload: { postId: string }) => {
    if (!payload?.postId) {
      return;
    }

    const room = `post:${payload.postId}`;

    socket.leave(room);
    socket.emit('unsubscribed', { postId: payload.postId });
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
}

export async function initializeRedisEvents(io: Server, subClient: Redis) {
  await subClient.subscribe('comments:events');

  subClient.on('message', (channel, message) => {
    if (channel !== 'comments:events') {
      return;
    }

    try {
      const event = JSON.parse(message) as TCommentEvent;

      if (!event.postId || !event.type) {
        return;
      }

      const room = `post:${event.postId}`;

      io.to(room).emit(event.type, {
        ...event.data,
        __meta: {
          eventId: event.eventId,
          occurredAt: event.occurredAt
        }
      });
    } catch (error) {
      console.error('Bad event payload', error);
    }
  });
}
