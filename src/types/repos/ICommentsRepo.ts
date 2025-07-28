import { TCreateCommentReqSchema } from 'src/api/schemas/comments/CreateCommentReqSchema';
import { TGetCommentByIdRespSchema } from 'src/api/schemas/comments/GetCommentByIdRespSchema';
import { TUpdateCommentReqSchema } from 'src/api/schemas/comments/UpdateCommentReqSchema';
import { TTransaction } from '../ITransaction';

export interface ICommentsRepo {
  createComment(
    payload: TCreateCommentReqSchema,
    postId: string,
    authorId: string
  ): Promise<TGetCommentByIdRespSchema>;
  createBulkComments(payload: TGetCommentByIdRespSchema[], tx?: TTransaction): Promise<boolean>;
  getCommentsByPostId(postId: string): Promise<TGetCommentByIdRespSchema[]>;
  updateComment(
    payload: TUpdateCommentReqSchema,
    commentId: string
  ): Promise<TGetCommentByIdRespSchema | null>;
  deleteComment(commentId: string): Promise<string | null>;
  getCommentById(commentId: string): Promise<TGetCommentByIdRespSchema | null>;
  softDeleteAllRelatedComments(
    userId: string,
    postIds: string[],
    tx?: TTransaction
  ): Promise<boolean>;
  restoreSoftDeletedComments(
    userId: string,
    postIds: string[],
    tx?: TTransaction
  ): Promise<boolean>;
  getAllRelatedComments(
    authorId: string,
    postIds: string[],
    tx?: TTransaction
  ): Promise<TGetCommentByIdRespSchema[]>;
}
