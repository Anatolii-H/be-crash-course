import { HttpError } from 'src/api/errors/HttpError';
import { IPostsRepo } from 'src/types/repos/IPostsRepo';

export async function deletePost(params: { postsRepo: IPostsRepo; postId: string }) {
  const deletedPost = await params.postsRepo.deletePost(params.postId);

  if (!deletedPost) {
    throw new HttpError(404, 'Cannot delete: post not found');
  }
}
