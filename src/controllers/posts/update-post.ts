import { IPostsRepo } from 'src/types/repos/IPostsRepo';
import { TUpdatePostReqSchema } from 'src/api/schemas/posts/UpdatePostReqSchema';
import { HttpError } from 'src/api/errors/HttpError';
import { ITransactionManager } from 'src/types/ITransaction';
import { IPostsToTagsRepo } from 'src/types/repos/IPostsToTagsRepo';

export async function updatePost(params: {
  postsRepo: IPostsRepo;
  postsToTagsRepo: IPostsToTagsRepo;
  payload: TUpdatePostReqSchema;
  postId: string;
  transactionManager: ITransactionManager;
}) {
  const { payload, postId, postsRepo, postsToTagsRepo, transactionManager } = params;

  return transactionManager.execute(async ({ sharedTx }) => {
    const updatedPost = await postsRepo.updatePost(payload, postId, sharedTx);

    if (!updatedPost) {
      throw new HttpError(404, 'Cannot update post: post not found');
    }

    await postsToTagsRepo.deleteTagsForPost(postId, sharedTx);

    if (payload.tagIds.length > 0) {
      const tagsToInsert = payload.tagIds.map((tagId) => ({
        postId,
        tagId
      }));

      await postsToTagsRepo.createPostsToTagsRelation(tagsToInsert, sharedTx);
    }

    return updatedPost;
  });
}
