import { TCreateCommentReqSchema } from 'src/api/schemas/comments/CreateCommentReqSchema';
import { ICommentsRepo } from 'src/types/repos/ICommentsRepo';

export async function createComment(params: {
  commentsRepo: ICommentsRepo;
  payload: TCreateCommentReqSchema;
  postId: string;
  authorId: string;
}) {
  return params.commentsRepo.createComment(params.payload, params.postId, params.authorId);
}
