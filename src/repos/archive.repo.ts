import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { archive } from 'src/services/drizzle/schema';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';

export function getArchiveRepo(db: NodePgDatabase): IArchiveRepo {
  const executor = (tx?: NodePgDatabase) => tx || db;

  return {
    async createArchiveEntry(archiveData, tx) {
      return executor(tx).insert(archive).values(archiveData).returning();
    },

    async getArchivedUsers(tx) {
      return executor(tx)
        .select({
          id: archive.id,
          archivedAt: archive.archivedAt,
          entityType: archive.entityType,
          entityId: archive.entityId
        })
        .from(archive)
        .where(eq(archive.entityType, 'user'));
    },

    async getArchiveEntry(archiveId, tx) {
      const [item] = await executor(tx).select().from(archive).where(eq(archive.id, archiveId));

      return item ?? null;
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
