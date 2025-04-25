import { HttpError } from 'src/api/errors/HttpError';
import { IPostsRepo } from 'src/types/entities/IPostsRepo';

export async function getPostById(params: { postsRepo: IPostsRepo; postId: string }) {
  const foundPost = await params.postsRepo.getPostById(params.postId);

  if (!foundPost) {
    throw new HttpError(404, 'Post not found');
  }

  return foundPost;
}
