import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PostsToTagsSchema } from 'src/api/schemas/tags/PostsToTagsSchema';
import { postsToTags } from 'src/services/drizzle/schema';
import { IPostsToTagsRepo } from 'src/types/repos/IPostsToTagsRepo';

export function getPostsToTagsRepo(db: NodePgDatabase): IPostsToTagsRepo {
  return {
    async createPostsToTagsRelation(payload, tx) {
      const executor = tx || db;

      const createdPostsToTags = await executor.insert(postsToTags).values(payload).returning();

      return PostsToTagsSchema.array().parse(createdPostsToTags);
    },

    async deleteTagsForPost(postId, tx) {
      const executor = tx || db;

      await executor.delete(postsToTags).where(eq(postsToTags.postId, postId));
    }
  };
}
