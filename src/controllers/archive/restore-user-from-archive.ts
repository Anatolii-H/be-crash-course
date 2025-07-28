import { HttpError } from 'src/api/errors/HttpError';
import { ITransactionManager } from 'src/types/ITransaction';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';
import { ICommentsRepo } from 'src/types/repos/ICommentsRepo';
import { IPostsRepo } from 'src/types/repos/IPostsRepo';
import { IPostsToTagsRepo } from 'src/types/repos/IPostsToTagsRepo';
import { IUsersRepo } from 'src/types/repos/IUsersRepo';
import { IIdentityService } from 'src/types/services/IIdentityService';

export async function restoreUserFromArchive(options: {
  transactionManager: ITransactionManager;
  archiveId: string;
  archiveRepo: IArchiveRepo;
  usersRepo: IUsersRepo;
  identityService: IIdentityService;
  postsRepo: IPostsRepo;
  postsToTagsRepo: IPostsToTagsRepo;
  commentsRepo: ICommentsRepo;
}) {
  const {
    archiveId,
    transactionManager,
    archiveRepo,
    usersRepo,
    identityService,
    postsRepo,
    postsToTagsRepo,
    commentsRepo
  } = options;

  const archiveEntry = await archiveRepo.getArchiveById(archiveId);

  if (!archiveEntry) {
    throw new HttpError(404, 'Archive entry not found');
  }

  const data = archiveEntry.data as any;

  // const subId = await identityService.createUserWithoutPassword({ email: data.user.email });

  await transactionManager.execute(async ({ sharedTx }) => {
    await usersRepo.createUser(
      {
        ...data.user,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      data.user.sub
    );

    if (data.posts.length === 0) {
      await archiveRepo.deleteArchiveEntry(archiveId, sharedTx);

      return;
    }

    const postsToInsert = [];
    const tagsToInsert = [];
    const commentsToInsert = [];

    for (const post of data.posts) {
      postsToInsert.push({
        ...post,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      if (post.tags.length > 0) {
        for (const tag of post.tags) {
          tagsToInsert.push({ postId: post.id, tagId: tag.id });
        }
      }
    }

    for (const comment of data.comments) {
      commentsToInsert.push({ ...comment, createdAt: new Date(), updatedAt: new Date() });
    }

    if (postsToInsert.length > 0) {
      await postsRepo.createBulkPosts(postsToInsert, sharedTx);
    }

    if (commentsToInsert.length > 0) {
      await commentsRepo.createBulkComments(commentsToInsert, sharedTx);
    }

    if (tagsToInsert.length > 0) {
      await postsToTagsRepo.createPostsToTagsRelation(tagsToInsert, sharedTx);
    }

    await archiveRepo.deleteArchiveEntry(archiveId, sharedTx);
  });

  await identityService.enableUser(data.user.email);
  // await sendInvite({
  //     baseUrl,
  //     emailTemplateId,
  //     fromEmail,
  //     mailService,
  //     signatureService,
  //     toEmail,
  //     tokenTTLInMillis
  //   });
}
