export type TCommentEvent = {
  type: 'comment.created' | 'comment.updated' | 'comment.deleted';
  postId: string;
  data: Record<string, unknown>;
  eventId?: string;
  occurredAt?: string;
};
