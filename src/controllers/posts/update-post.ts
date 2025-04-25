import { IPostsRepo } from 'src/types/entities/IPostsRepo';
import { TUpdatePostReqSchema } from 'src/api/routes/schemas/posts/UpdatePostReqSchema';
import { HttpError } from 'src/api/errors/HttpError';

export async function updatePost(params: {
  postsRepo: IPostsRepo;
  payload: TUpdatePostReqSchema;
  postId: string;
}) {
  const updatedPost = await params.postsRepo.updatePost(params.payload, params.postId);

  if (!updatedPost) {
    throw new HttpError(404, 'Cannot update: post not found');
  }

  return updatedPost;
}
