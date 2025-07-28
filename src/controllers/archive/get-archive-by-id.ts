import { HttpError } from 'src/api/errors/HttpError';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';

export async function getArchiveById(options: { archiveRepo: IArchiveRepo; archiveId: string }) {
  const foundArchive = await options.archiveRepo.getArchiveById(options.archiveId);

  if (!foundArchive) {
    throw new HttpError(404, 'Archive not found');
  }

  return foundArchive;
}
