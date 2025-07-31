import { ITransactionManager } from 'src/types/ITransaction';
import { ICommentsRepo } from 'src/types/repos/ICommentsRepo';
import { IPostsRepo } from 'src/types/repos/IPostsRepo';
import { IUsersRepo } from 'src/types/repos/IUsersRepo';
import { disableUser } from '../common/disable-user';
import { IIdentityService } from 'src/types/services/IIdentityService';
import { HttpError } from 'src/api/errors/HttpError';

export async function softDeleteUser(options: {
  transactionManager: ITransactionManager;
  usersRepo: IUsersRepo;
  postsRepo: IPostsRepo;
  commentsRepo: ICommentsRepo;
  userId: string;
  requestUserId: string;
  identityService: IIdentityService;
}) {
  const {
    transactionManager,
    usersRepo,
    postsRepo,
    commentsRepo,
    userId,
    identityService,
    requestUserId
  } = options;

  if (requestUserId === userId) {
    throw new HttpError(400, 'You cannot delete yourself');
  }

  await transactionManager.execute(async ({ sharedTx }) => {
    const userPostIds = (await postsRepo.getAllPostIdsByAuthorId(userId, sharedTx)).map(
      ({ id }) => id
    );

    await Promise.all([
      commentsRepo.softDeleteAllRelatedComments(userId, userPostIds, sharedTx),
      postsRepo.softDeletePostsByAuthorId(userId, sharedTx),
      usersRepo.softDeleteUser(userId, sharedTx)
    ]);
  });

  await disableUser({
    usersRepo,
    identityService,
    userId,
    requestUserId
  });
}
