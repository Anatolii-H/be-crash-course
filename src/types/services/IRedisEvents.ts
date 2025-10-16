export type TCommentEvent = {
  // WEBSOCKET: треба зробити енам для type
  type: 'comment.created' | 'comment.updated' | 'comment.deleted';
  postId: string;
  data: Record<string, unknown>;
  eventId?: string;
  occurredAt?: string;
};
