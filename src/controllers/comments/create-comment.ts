import { TCreateCommentReqSchema } from 'src/api/routes/schemas/comments/CreateCommentReqSchema';
import { ICommentsRepo } from 'src/types/entities/ICommentsRepo';

export async function createComment(params: {
  commentsRepo: ICommentsRepo;
  payload: TCreateCommentReqSchema;
  postId: string;
}) {
  throw new Error('My test error');
  return params.commentsRepo.createComment(params.payload, params.postId);
}
