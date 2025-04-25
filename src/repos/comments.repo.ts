import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

import { ICommentsRepo } from 'src/types/entities/ICommentsRepo';
import { comments } from 'src/services/drizzle/schema';

export function getCommentsRepo(db: NodePgDatabase): ICommentsRepo {
  return {
    async createComment(payload, postId) {
      const [createdComment] = await db
        .insert(comments)
        .values({ ...payload, postId })
        .returning();

      return createdComment;
    },

    async getCommentsByPostId(postId) {
      return db.select().from(comments).where(eq(comments.postId, postId));
    },

    async updateComment(payload, commentId) {
      const [updatedComment] = await db
        .update(comments)
        .set(payload)
        .where(eq(comments.id, commentId))
        .returning();

      if (!updatedComment) {
        return null;
      }

      return updatedComment;
    },

    async deleteComment(commentId) {
      const [deletedComment] = await db
        .delete(comments)
        .where(eq(comments.id, commentId))
        .returning({ id: comments.id });

      if (!deletedComment) {
        return null;
      }

      return deletedComment.id;
    }
  };
}
