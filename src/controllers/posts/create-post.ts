import { TCreatePostReqSchema } from 'src/api/schemas/posts/CreatePostReqSchema';
import { ITransactionManager } from 'src/types/ITransaction';
import { IPostsRepo } from 'src/types/repos/IPostsRepo';
import { IPostsToTagsRepo } from 'src/types/repos/IPostsToTagsRepo';

export async function createPost(params: {
  postsRepo: IPostsRepo;
  postsToTagsRepo: IPostsToTagsRepo;
  payload: TCreatePostReqSchema;
  authorId: string;
  transactionManager: ITransactionManager;
}) {
  const { authorId, payload, postsRepo, postsToTagsRepo, transactionManager } = params;

  return transactionManager.execute(async ({ sharedTx }) => {
    const createdPost = await postsRepo.createPost(payload, authorId, sharedTx);

    if (payload.tagIds.length > 0) {
      const tagsToInsert = payload.tagIds.map((tagId) => ({
        postId: createdPost.id,
        tagId
      }));

      await postsToTagsRepo.createPostsToTagsRelation(tagsToInsert, sharedTx);
    }

    return createdPost;
  });
}
