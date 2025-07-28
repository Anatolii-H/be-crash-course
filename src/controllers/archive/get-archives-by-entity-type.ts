import { TGetArchivesQueries } from 'src/api/schemas/archive/GetArchiveByIdRespSchema';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';

export function getArchivesByEntityType(options: {
  archiveRepo: IArchiveRepo;
  queries: TGetArchivesQueries;
}) {
  return options.archiveRepo.getArchivesByEntityType(options.queries.entityType);
}
