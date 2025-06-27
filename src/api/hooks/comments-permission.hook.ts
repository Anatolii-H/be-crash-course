import { preHandlerAsyncHookHandler } from 'fastify';
import { HttpError } from '../errors/HttpError';

export const commentsPermissionHook: preHandlerAsyncHookHandler = async function (request) {
  const userId = request.profile?.id;
  const { commentId } = request.params as { commentId: string };

  const comment = await this.repos.commentsRepo.getCommentById(commentId);

  if (!comment) {
    throw new HttpError(404, 'Comment not found');
  }

  const isOwner = comment.authorId === userId;
  const isAdmin = request.profile?.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new HttpError(403, 'Forbidden: You are not the author or admin');
  }
};
