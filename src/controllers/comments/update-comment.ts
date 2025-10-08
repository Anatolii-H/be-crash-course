import { HttpError } from 'src/api/errors/HttpError';
import { TUpdateCommentReqSchema } from 'src/api/schemas/comments/UpdateCommentReqSchema';
import { publishCommentEvent } from 'src/services/redis/publisher';
import { IUUIDService } from 'src/services/uuid/uuid.service';
import { ICommentsRepo } from 'src/types/repos/ICommentsRepo';
import { IUsersRepo } from 'src/types/repos/IUsersRepo';
import { TCommentEvent } from 'src/types/services/IRedisEvents';

export async function updateComment(params: {
  commentsRepo: ICommentsRepo;
  usersRepo: IUsersRepo;
  payload: TUpdateCommentReqSchema;
  commentId: string;
  uuidService: IUUIDService;
}) {
  const updatedComment = await params.commentsRepo.updateComment(params.payload, params.commentId);

  if (!updatedComment) {
    throw new HttpError(404, 'Cannot update: comment not found');
  }

  const author = await params.usersRepo.getUserById({ userId: updatedComment.authorId });

  const event: TCommentEvent = {
    type: 'comment.updated',
    postId: updatedComment.postId,
    data: { comment: { ...updatedComment, author } },
    eventId: params.uuidService.getUUID(),
    occurredAt: new Date().toISOString()
  };

  await publishCommentEvent(event);

  return updatedComment;
}
