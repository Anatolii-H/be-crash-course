import { preHandlerAsyncHookHandler } from 'fastify';
import { HttpError } from '../errors/HttpError';

export const postsPermissionHook: preHandlerAsyncHookHandler = async function (request) {
  const userId = request.profile?.id;
  const { postId } = request.params as { postId: string };

  const post = await this.repos.postsRepo.getPostById(postId);

  if (!post) {
    throw new HttpError(404, 'Post not found');
  }

  const isOwner = post.author.id === userId;
  const isAdmin = request.profile?.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new HttpError(403, 'Forbidden: You are not the author or an admin');
  }
};
