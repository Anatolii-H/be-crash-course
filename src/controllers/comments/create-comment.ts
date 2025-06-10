import { TCreateCommentReqSchema } from 'src/api/schemas/comments/CreateCommentReqSchema';
import { ICommentsRepo } from 'src/types/entities/ICommentsRepo';

export async function createComment(params: {
  commentsRepo: ICommentsRepo;
  payload: TCreateCommentReqSchema;
  postId: string;
}) {
  return params.commentsRepo.createComment(params.payload, params.postId);
}
