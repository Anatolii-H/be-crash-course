import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq, inArray, isNull, or } from 'drizzle-orm';

import { ICommentsRepo } from 'src/types/repos/ICommentsRepo';
import { comments } from 'src/services/drizzle/schema';
import { GetCommentByIdRespSchema } from 'src/api/schemas/comments/GetCommentByIdRespSchema';

function isCommentNotDeleted() {
  return isNull(comments.deletedAt);
}

export function getCommentsRepo(db: NodePgDatabase): ICommentsRepo {
  return {
    async createComment(payload, postId, authorId) {
      const [createdComment] = await db
        .insert(comments)
        .values({ ...payload, postId, authorId })
        .returning();

      return GetCommentByIdRespSchema.parse(createdComment);
    },

    async createBulkComments(payload, tx) {
      const executor = tx || db;
      const createdComments = await executor.insert(comments).values(payload).returning();

      return Boolean(createdComments.length);
    },

    async getCommentsByPostId(postId) {
      // CODE REVIEW: Ти маєш валідувати респонс з бази після гету. 
      return db
        .select()
        .from(comments)
        .where(and(eq(comments.postId, postId), isCommentNotDeleted()));
    },

    async updateComment(payload, commentId) {
      const [updatedComment] = await db
        .update(comments)
        .set(payload)
        .where(and(eq(comments.id, commentId), isCommentNotDeleted()))
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
      const [foundComment] = await db
        .select()
        .from(comments)
        .where(and(eq(comments.id, commentId), isCommentNotDeleted()));

      if (!foundComment) {
        return null;
      }

      return GetCommentByIdRespSchema.parse(foundComment);
    },

    async softDeleteAllRelatedComments(userId, postIds, tx) {
      const executor = tx || db;

      if (postIds.length === 0) {
        const softDeletedComments = await executor
          .update(comments)
          .set({ deletedAt: new Date() })
          .where(eq(comments.authorId, userId))
          .returning();

        return Boolean(softDeletedComments.length);
      }

      const softDeletedComments = await executor
        .update(comments)
        .set({ deletedAt: new Date() })
        .where(or(eq(comments.authorId, userId), inArray(comments.postId, postIds)))
        .returning();

      return Boolean(softDeletedComments.length);
    },

    async restoreSoftDeletedComments(userId, postIds, tx) {
      const executor = tx || db;

      if (postIds.length === 0) {
        const restoredComments = await executor
          .update(comments)
          .set({ deletedAt: null })
          .where(eq(comments.authorId, userId))
          .returning();

        return Boolean(restoredComments.length);
      }

      const restoredComments = await executor
        .update(comments)
        .set({ deletedAt: null })
        .where(or(eq(comments.authorId, userId), inArray(comments.postId, postIds)))
        .returning();

      return Boolean(restoredComments.length);
    },

    async getAllRelatedComments(userId, postIds, tx) {
      const executor = tx || db;

      if (postIds.length === 0) {
        return executor.select().from(comments).where(eq(comments.authorId, userId));
      }

      // CODE REVIEW: Валідація респонсу з бази після гету. 
      return executor
        .select()
        .from(comments)
        .where(or(eq(comments.authorId, userId), inArray(comments.postId, postIds)));
    }
  };
}
