import { TCreatePostReqSchema } from 'src/api/routes/schemas/posts/CreatePostReqSchema';
import { TUpdatePostReqSchema } from 'src/api/routes/schemas/posts/UpdatePostReqSchema';
import {
  TGetPostByIdRespSchemaExtendedMetadata,
  TGetPostByIdRespSchemaExtendedComments,
  TGetPostByIdRespSchema,
  TGetPostsReqQueries
} from 'src/api/routes/schemas/posts/GetPostByIdRespSchema';

export interface IPostsRepo {
  createPost(payload: TCreatePostReqSchema): Promise<TGetPostByIdRespSchema>;
  getPostById(postId: string): Promise<TGetPostByIdRespSchemaExtendedComments | null>;
  getPosts(queries: TGetPostsReqQueries): Promise<TGetPostByIdRespSchemaExtendedMetadata>;
  updatePost(payload: TUpdatePostReqSchema, postId: string): Promise<TGetPostByIdRespSchema | null>;
  deletePost(postId: string): Promise<string | null>;
}
