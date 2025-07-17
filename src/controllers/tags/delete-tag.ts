import { HttpError } from 'src/api/errors/HttpError';
import { ITagsRepo } from 'src/types/repos/ITagsRepo';

export async function deleteTag(params: { tagsRepo: ITagsRepo; tagId: string }) {
  const isTagDeleted = await params.tagsRepo.deleteTag(params.tagId);

  if (!isTagDeleted) {
    throw new HttpError(404, 'Cannot delete: tag not found');
  }
}
