import { ICommentsRepo } from 'src/types/repos/ICommentsRepo';

export async function getCommentsByPostId(params: { commentsRepo: ICommentsRepo; postId: string }) {
  return params.commentsRepo.getCommentsByPostId(params.postId);
}
