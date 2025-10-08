import { TCreateCommentReqSchema } from 'src/api/schemas/comments/CreateCommentReqSchema';
import { publishCommentEvent } from 'src/services/redis/publisher';
import { IUUIDService } from 'src/services/uuid/uuid.service';
import { ICommentsRepo } from 'src/types/repos/ICommentsRepo';
import { IUsersRepo } from 'src/types/repos/IUsersRepo';
import { TCommentEvent } from 'src/types/services/IRedisEvents';

export async function createComment(params: {
  commentsRepo: ICommentsRepo;
  usersRepo: IUsersRepo;
  payload: TCreateCommentReqSchema;
  postId: string;
  authorId: string;
  uuidService: IUUIDService;
}) {
  const comment = await params.commentsRepo.createComment(
    params.payload,
    params.postId,
    params.authorId
  );

  const author = await params.usersRepo.getUserById({ userId: params.authorId });

  const event: TCommentEvent = {
    type: 'comment.created',
    postId: params.postId,
    data: { comment: { ...comment, author } },
    eventId: params.uuidService.getUUID(),
    occurredAt: new Date().toISOString()
  };

  await publishCommentEvent(event);

  return comment;
}
