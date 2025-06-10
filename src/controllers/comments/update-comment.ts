import { HttpError } from 'src/api/errors/HttpError';
import { TUpdateCommentReqSchema } from 'src/api/schemas/comments/UpdateCommentReqSchema';
import { ICommentsRepo } from 'src/types/entities/ICommentsRepo';

export async function updateComment(params: {
  commentsRepo: ICommentsRepo;
  payload: TUpdateCommentReqSchema;
  commentId: string;
}) {
  const updatedComment = await params.commentsRepo.updateComment(params.payload, params.commentId);

  if (!updatedComment) {
    throw new HttpError(404, 'Cannot update: comment not found');
  }

  return updatedComment;
}
