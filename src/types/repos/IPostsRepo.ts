import { TCreatePostReqSchema } from 'src/api/schemas/posts/CreatePostReqSchema';
import { TUpdatePostReqSchema } from 'src/api/schemas/posts/UpdatePostReqSchema';
import {
  TGetPostByIdRespSchemaExtendedMetadata,
  TGetPostByIdRespSchemaExtended,
  TGetPostByIdRespSchema,
  TGetPostsReqQueries,
  TGetPostByIdRespSchemaWithTags
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
  getAllPostIdsByAuthorId(authorId: string, tx?: TTransaction): Promise<{ id: string }[]>;
  getAllSoftDeletedPostIdsByAuthorId(
    authorId: string,
    tx?: TTransaction
  ): Promise<{ id: string }[]>;
  softDeletePostsByAuthorId(authorId: string, tx?: TTransaction): Promise<boolean>;
  restorePostsByAuthorId(authorId: string, tx?: TTransaction): Promise<boolean>;
  getAllPostsWithTagsByAuthorId(
    authorId: string,
    tx?: TTransaction
  ): Promise<TGetPostByIdRespSchemaWithTags[]>;
  createBulkPosts(payload: TGetPostByIdRespSchema[], tx?: TTransaction): Promise<boolean>;
  getExistingPostIds(postIds: string[], tx?: TTransaction): Promise<{ id: string }[]>;
}
