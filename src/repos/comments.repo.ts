import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

import { ICommentsRepo } from 'src/types/repos/ICommentsRepo';
import { comments } from 'src/services/drizzle/schema';
import { GetCommentByIdRespSchema } from 'src/api/schemas/comments/GetCommentByIdRespSchema';

export function getCommentsRepo(db: NodePgDatabase): ICommentsRepo {
  return {
    async createComment(payload, postId, authorId) {
      const [createdComment] = await db
        .insert(comments)
        .values({ ...payload, postId, authorId })
        .returning();

      return GetCommentByIdRespSchema.parse(createdComment);
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

      return GetCommentByIdRespSchema.parse(updatedComment);
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
    },

    async getCommentById(commentId) {
      const [foundComment] = await db.select().from(comments).where(eq(comments.id, commentId));

      if (!foundComment) {
        return null;
      }

      return GetCommentByIdRespSchema.parse(foundComment);
    }
  };
}
