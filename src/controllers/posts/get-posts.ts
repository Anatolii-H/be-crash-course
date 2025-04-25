import { IPostsRepo } from 'src/types/entities/IPostsRepo';
import { TGetPostsReqQueries } from 'src/api/routes/schemas/posts/GetPostByIdRespSchema';

export async function getPosts(params: { postsRepo: IPostsRepo; queries: TGetPostsReqQueries }) {
  return params.postsRepo.getPosts(params.queries);
}
