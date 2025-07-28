import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
  GetArchiveByIdRespSchema,
  GetArchiveByIdRespSchemaWithoutData
} from 'src/api/schemas/archive/GetArchiveByIdRespSchema';

import { archive } from 'src/services/drizzle/schema';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';

export function getArchiveRepo(db: NodePgDatabase): IArchiveRepo {
  const executor = (tx?: NodePgDatabase) => tx || db;

  return {
    async createArchiveEntry(archiveData, tx) {
      const [createdArchiveEntry] = await executor(tx)
        .insert(archive)
        .values(archiveData)
        .returning();

      return GetArchiveByIdRespSchema.parse(createdArchiveEntry);
    },

    async getArchivesByEntityType(entityType, tx) {
      const archivesByEntityType = await executor(tx)
        .select({
          id: archive.id,
          archivedAt: archive.archivedAt,
          entityType: archive.entityType,
          entityId: archive.entityId
        })
        .from(archive)
        .where(eq(archive.entityType, entityType));

      return GetArchiveByIdRespSchemaWithoutData.array().parse(archivesByEntityType);
    },

    async getArchiveById(archiveId) {
      const [archiveData] = await executor()
        .select()
        .from(archive)
        .where(eq(archive.id, archiveId));

      if (!archiveData) {
        return null;
      }

      return GetArchiveByIdRespSchema.parse(archiveData);
    },

    async deleteArchiveEntry(archiveId, tx) {
      const deletedArchive = await executor(tx)
        .delete(archive)
        .where(eq(archive.id, archiveId))
        .returning();

      return Boolean(deletedArchive.length);
    }
  };
}
