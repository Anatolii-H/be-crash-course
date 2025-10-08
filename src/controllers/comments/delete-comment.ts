import { HttpError } from 'src/api/errors/HttpError';
import { publishCommentEvent } from 'src/services/redis/publisher';
import { IUUIDService } from 'src/services/uuid/uuid.service';
import { ICommentsRepo } from 'src/types/repos/ICommentsRepo';
import { TCommentEvent } from 'src/types/services/IRedisEvents';

export async function deleteComment(params: {
  commentsRepo: ICommentsRepo;
  commentId: string;
  postId: string;
  uuidService: IUUIDService;
}) {
  const deletedCommentId = await params.commentsRepo.deleteComment(params.commentId);

  if (!deletedCommentId) {
    throw new HttpError(404, 'Cannot delete: comment not found');
  }

  const event: TCommentEvent = {
    type: 'comment.deleted',
    postId: params.postId,
    data: { comment: { id: deletedCommentId } },
    eventId: params.uuidService.getUUID(),
    occurredAt: new Date().toISOString()
  };

  await publishCommentEvent(event);
}
