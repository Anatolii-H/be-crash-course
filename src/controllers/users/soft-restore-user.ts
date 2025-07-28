import { ITransactionManager } from 'src/types/ITransaction';
import { ICommentsRepo } from 'src/types/repos/ICommentsRepo';
import { IPostsRepo } from 'src/types/repos/IPostsRepo';
import { IUsersRepo } from 'src/types/repos/IUsersRepo';
import { enableUser } from './enable-user';
import { IIdentityService } from 'src/types/services/IIdentityService';

export async function softRestoreUser(options: {
  transactionManager: ITransactionManager;
  usersRepo: IUsersRepo;
  postsRepo: IPostsRepo;
  commentsRepo: ICommentsRepo;
  userId: string;
  identityService: IIdentityService;
}) {
  const { transactionManager, usersRepo, postsRepo, commentsRepo, userId, identityService } =
    options;

  await transactionManager.execute(async ({ sharedTx }) => {
    const userPostIds = (await postsRepo.getAllSoftDeletedPostIdsByAuthorId(userId, sharedTx)).map(
      ({ id }) => id
    );

    await Promise.all([
      commentsRepo.restoreSoftDeletedComments(userId, userPostIds, sharedTx),
      postsRepo.restorePostsByAuthorId(userId, sharedTx),
      usersRepo.restoreSoftDeletedUser(userId, sharedTx)
    ]);
  });

  await enableUser({
    identityService,
    userId,
    usersRepo
  });
}
