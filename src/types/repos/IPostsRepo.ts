import { TCreatePostReqSchema } from 'src/api/schemas/posts/CreatePostReqSchema';
import { TUpdatePostReqSchema } from 'src/api/schemas/posts/UpdatePostReqSchema';
import {
  TGetPostByIdRespSchemaExtendedMetadata,
  TGetPostByIdRespSchemaExtended,
  TGetPostByIdRespSchema,
  TGetPostsReqQueries
} from 'src/api/schemas/posts/GetPostByIdRespSchema';

export interface IPostsRepo {
  createPost(payload: TCreatePostReqSchema, authorId: string): Promise<TGetPostByIdRespSchema>;
  getPostById(postId: string): Promise<TGetPostByIdRespSchemaExtended | null>;
  getPosts(queries: TGetPostsReqQueries): Promise<TGetPostByIdRespSchemaExtendedMetadata>;
  updatePost(payload: TUpdatePostReqSchema, postId: string): Promise<TGetPostByIdRespSchema | null>;
  deletePost(postId: string): Promise<string | null>;
}
