import { HttpError } from 'src/api/errors/HttpError';
import { ITransactionManager } from 'src/types/ITransaction';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';
import { ICommentsRepo } from 'src/types/repos/ICommentsRepo';
import { IPostsRepo } from 'src/types/repos/IPostsRepo';
import { IUsersRepo } from 'src/types/repos/IUsersRepo';
import { IIdentityService } from 'src/types/services/IIdentityService';

export async function deleteUser(options: {
  transactionManager: ITransactionManager;
  usersRepo: IUsersRepo;
  userId: string;
  requestUserId: string;
  postsRepo: IPostsRepo;
  commentsRepo: ICommentsRepo;
  archiveRepo: IArchiveRepo;
  identityService: IIdentityService;
}) {
  const {
    transactionManager,
    usersRepo,
    userId,
    requestUserId,
    postsRepo,
    archiveRepo,
    commentsRepo,
    identityService
  } = options;

  if (requestUserId === userId) {
    throw new HttpError(400, 'You cannot delete yourself');
  }

  const user = await usersRepo.getUserById({ userId });

  if (!user) {
    throw new Error('User not found');
  }

  await transactionManager.execute(async ({ sharedTx }) => {
    const postsWithTags = await postsRepo.getAllPostsWithTagsByAuthorId(userId, sharedTx);
    const postIds = postsWithTags.map((p) => p.id);
    const relatedComments = await commentsRepo.getAllRelatedComments(userId, postIds, sharedTx);

    const archiveData = {
      user,
      posts: postsWithTags,
      comments: relatedComments
    };

    await archiveRepo.createArchiveEntry(
      {
        entityType: 'user',
        entityId: userId,
        data: archiveData
      },
      sharedTx
    );

    await usersRepo.deleteUser(userId, sharedTx);
  });

  await identityService.disableUser(user.email);

  // or delete from cognito instead of disable
  // await identityService.deleteUser(user.email);
}
