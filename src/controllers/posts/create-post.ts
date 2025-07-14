import { TCreatePostReqSchema } from 'src/api/schemas/posts/CreatePostReqSchema';
import { IPostsRepo } from 'src/types/repos/IPostsRepo';

export async function createPost(params: {
  postsRepo: IPostsRepo;
  payload: TCreatePostReqSchema;
  authorId: string;
}) {
  return params.postsRepo.createPost(params.payload, params.authorId);
}
