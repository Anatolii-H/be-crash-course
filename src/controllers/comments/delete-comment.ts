import { HttpError } from 'src/api/errors/HttpError';
import { ICommentsRepo } from 'src/types/entities/ICommentsRepo';

export async function deleteComment(params: { commentsRepo: ICommentsRepo; commentId: string }) {
  const deletedComment = await params.commentsRepo.deleteComment(params.commentId);

  if (!deletedComment) {
    throw new HttpError(404, 'Cannot delete: comment not found');
  }
}
