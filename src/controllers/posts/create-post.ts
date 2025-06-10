import { TCreatePostReqSchema } from 'src/api/schemas/posts/CreatePostReqSchema';
import { IPostsRepo } from 'src/types/entities/IPostsRepo';

export async function createPost(params: { postsRepo: IPostsRepo; payload: TCreatePostReqSchema }) {
  return params.postsRepo.createPost(params.payload);
}
