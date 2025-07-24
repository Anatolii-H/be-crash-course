import { TCreatePostReqSchema } from 'src/api/schemas/posts/CreatePostReqSchema';
import { TUpdatePostReqSchema } from 'src/api/schemas/posts/UpdatePostReqSchema';
import {
  TGetPostByIdRespSchemaExtendedMetadata,
  TGetPostByIdRespSchemaExtended,
  TGetPostByIdRespSchema,
  TGetPostsReqQueries
} from 'src/api/schemas/posts/GetPostByIdRespSchema';
import { TTransaction } from '../ITransaction';

export interface IPostsRepo {
  createPost(
    payload: TCreatePostReqSchema,
    authorId: string,
    tx?: TTransaction
  ): Promise<TGetPostByIdRespSchema>;
  getPostById(postId: string): Promise<TGetPostByIdRespSchemaExtended | null>;
  getPosts(queries: TGetPostsReqQueries): Promise<TGetPostByIdRespSchemaExtendedMetadata>;
  updatePost(
    payload: TUpdatePostReqSchema,
    postId: string,
    tx?: TTransaction
  ): Promise<TGetPostByIdRespSchema | null>;
  deletePost(postId: string): Promise<string | null>;
}
