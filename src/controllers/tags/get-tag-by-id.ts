import { HttpError } from 'src/api/errors/HttpError';
import { ITagsRepo } from 'src/types/repos/ITagsRepo';

export async function getTagById(params: { tagsRepo: ITagsRepo; tagId: string }) {
  const tag = await params.tagsRepo.getTagById(params.tagId);

  if (!tag) {
    throw new HttpError(404, 'Tag is not found');
  }

  return tag;
}
