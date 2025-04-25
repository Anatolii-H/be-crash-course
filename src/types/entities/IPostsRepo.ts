import { TCreatePostReqSchema } from 'src/api/routes/schemas/posts/CreatePostReqSchema';
import { TUpdatePostReqSchema } from 'src/api/routes/schemas/posts/UpdatePostReqSchema';
import {
  TGetPostByIdRespSchemaExtended,
  TGetPostByIdRespSchema,
  TGetPostsReqQueries
} from 'src/api/routes/schemas/posts/GetPostByIdRespSchema';

export interface IPostsRepo {
  createPost(payload: TCreatePostReqSchema): Promise<TGetPostByIdRespSchema>;
  getPostById(postId: string): Promise<TGetPostByIdRespSchemaExtended | null>;
  getPosts(queries: TGetPostsReqQueries): Promise<TGetPostByIdRespSchemaExtended[]>;
  updatePost(payload: TUpdatePostReqSchema, postId: string): Promise<TGetPostByIdRespSchema | null>;
  deletePost(postId: string): Promise<string | null>;
}
