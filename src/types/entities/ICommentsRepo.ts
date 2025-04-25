import { TCreateCommentReqSchema } from 'src/api/routes/schemas/comments/CreateCommentReqSchema';
import { TGetCommentByIdRespSchema } from 'src/api/routes/schemas/comments/GetCommentByIdRespSchema';
import { TUpdateCommentReqSchema } from 'src/api/routes/schemas/comments/UpdateCommentReqSchema';

export interface ICommentsRepo {
  createComment(
    payload: TCreateCommentReqSchema,
    postId: string
  ): Promise<TGetCommentByIdRespSchema>;
  getCommentsByPostId(postId: string): Promise<TGetCommentByIdRespSchema[]>;
  updateComment(
    payload: TUpdateCommentReqSchema,
    commentId: string
  ): Promise<TGetCommentByIdRespSchema | null>;
  deleteComment(commentId: string): Promise<string | null>;
}
