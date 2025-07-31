import { HttpError } from 'src/api/errors/HttpError';
import { TGetCommentByIdRespSchema } from 'src/api/schemas/comments/GetCommentByIdRespSchema';
import {
  TGetPostByIdRespSchema,
  TGetPostByIdRespSchemaWithTags
} from 'src/api/schemas/posts/GetPostByIdRespSchema';
import { TCreatePostsToTagsSchema } from 'src/api/schemas/tags/PostsToTagsSchema';
import { TUserSchema } from 'src/api/schemas/users/GetUserByIdRespSchema';
import { ITransactionManager } from 'src/types/ITransaction';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';
import { ICommentsRepo } from 'src/types/repos/ICommentsRepo';
import { IPostsRepo } from 'src/types/repos/IPostsRepo';
import { IPostsToTagsRepo } from 'src/types/repos/IPostsToTagsRepo';
import { ITagsRepo } from 'src/types/repos/ITagsRepo';
import { IUsersRepo } from 'src/types/repos/IUsersRepo';
import { IIdentityService } from 'src/types/services/IIdentityService';

export async function restoreUserFromArchive(options: {
  transactionManager: ITransactionManager;
  archiveId: string;
  archiveRepo: IArchiveRepo;
  usersRepo: IUsersRepo;
  identityService: IIdentityService;
  postsRepo: IPostsRepo;
  tagsRepo: ITagsRepo;
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
    commentsRepo,
    tagsRepo
  } = options;

  const archiveEntry = await archiveRepo.getArchiveById(archiveId);

  if (!archiveEntry) {
    throw new HttpError(404, 'Archive entry not found');
  }

  const data = archiveEntry.data as {
    user: TUserSchema;
    posts: TGetPostByIdRespSchemaWithTags[];
    comments: TGetCommentByIdRespSchema[];
  };

  function extractIdSet(items: { id: string }[]): Set<string> {
    return new Set(items.map(({ id }) => id));
  }

  await transactionManager.execute(async ({ sharedTx }) => {
    const userPayload = {
      ...data.user,
      createdAt: new Date(data.user.createdAt),
      updatedAt: new Date(data.user.updatedAt)
    };

    await usersRepo.createUser(userPayload, data.user.sub, sharedTx);

    const archiveCommentAuthorIds = [...new Set(data.comments.map(({ authorId }) => authorId))];
    const archivePostIdsSet = new Set(data.posts.map((post) => post.id));
    const externalPostIds = Array.from(
      new Set(data.comments.filter((c) => !archivePostIdsSet.has(c.postId)).map((c) => c.postId))
    );
    const archiveTagIds = Array.from(
      new Set(data.posts.flatMap(({ tags }) => tags.map(({ id }) => id)))
    );
    const existingTagIds = await tagsRepo.getExistingTagIds(archiveTagIds, sharedTx);
    const existingTagIdSet = extractIdSet(existingTagIds);

    const postsToInsert: TGetPostByIdRespSchema[] = [];
    const commentsToInsert: TGetCommentByIdRespSchema[] = [];
    const tagsToInsert: TCreatePostsToTagsSchema[] = [];

    data.posts.forEach((post) => {
      postsToInsert.push({
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt)
      });

      if (post.tags.length > 0) {
        post.tags.forEach((tag) => {
          if (existingTagIdSet.has(tag.id)) {
            tagsToInsert.push({ postId: post.id, tagId: tag.id });
          }
        });
      }
    });

    if (postsToInsert.length > 0) {
      await postsRepo.createBulkPosts(postsToInsert, sharedTx);
    }

    if (tagsToInsert.length > 0) {
      await postsToTagsRepo.createPostsToTagsRelation(tagsToInsert, sharedTx);
    }

    const [existingUserIds, existingPostIds] = await Promise.all([
      usersRepo.getExistingUserIds(archiveCommentAuthorIds, sharedTx),
      postsRepo.getExistingPostIds([...externalPostIds, ...archivePostIdsSet], sharedTx)
    ]);

    const existingUserIdSet = extractIdSet(existingUserIds);
    const existingPostIdSet = extractIdSet(existingPostIds);

    data.comments.forEach((comment) => {
      if (existingUserIdSet.has(comment.authorId) && existingPostIdSet.has(comment.postId)) {
        commentsToInsert.push({
          ...comment,
          createdAt: new Date(comment.createdAt),
          updatedAt: new Date(comment.updatedAt)
        });
      }
    });

    if (commentsToInsert.length > 0) {
      await commentsRepo.createBulkComments(commentsToInsert, sharedTx);
    }

    await archiveRepo.deleteArchiveEntry(archiveId, sharedTx);
  });

  await identityService.enableUser(data.user.email);
}
