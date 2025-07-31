import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, inArray } from 'drizzle-orm';

import { tags } from 'src/services/drizzle/schema';
import { ITagsRepo } from 'src/types/repos/ITagsRepo';
import { GetTagByIdRespSchema } from 'src/api/schemas/tags/GetTagByIdRespSchema';

export function getTagsRepo(db: NodePgDatabase): ITagsRepo {
  return {
    async createTag(payload) {
      const [createdTag] = await db.insert(tags).values(payload).returning();

      return GetTagByIdRespSchema.parse(createdTag);
    },

    async getExistingTagIds(tagIds, tx) {
      const executor = tx || db;

      return executor.select({ id: tags.id }).from(tags).where(inArray(tags.id, tagIds));
    },

    async deleteTag(tagId) {
      const [deletedTag] = await db
        .delete(tags)
        .where(eq(tags.id, tagId))
        .returning({ id: tags.id });

      return Boolean(deletedTag);
    },

    async getTagById(tagId) {
      const [tag] = await db.select().from(tags).where(eq(tags.id, tagId));

      if (!tag) {
        return null;
      }

      return GetTagByIdRespSchema.parse(tag);
    },

    async getTags() {
      return db.select().from(tags);
    },

    async updateTag(tagId, payload) {
      const [updatedTag] = await db.update(tags).set(payload).where(eq(tags.id, tagId)).returning();

      if (!updatedTag) {
        return null;
      }

      return GetTagByIdRespSchema.parse(updatedTag);
    }
  };
}
