import { HttpError } from 'src/api/errors/HttpError';
import { TCreateTagReqSchema } from 'src/api/schemas/tags/CreateTagReqSchema';
import { ITagsRepo } from 'src/types/repos/ITagsRepo';

export async function updateTag(params: {
  tagsRepo: ITagsRepo;
  payload: TCreateTagReqSchema;
  tagId: string;
}) {
  const updatedTag = await params.tagsRepo.updateTag(params.tagId, params.payload);

  if (!updatedTag) {
    throw new HttpError(404, 'Tag is not found for update');
  }

  return updatedTag;
}
