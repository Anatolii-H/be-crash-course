import { TCreateTagReqSchema } from 'src/api/schemas/tags/CreateTagReqSchema';
import { ITagsRepo } from 'src/types/repos/ITagsRepo';

export async function createTag(params: { tagsRepo: ITagsRepo; payload: TCreateTagReqSchema }) {
  return params.tagsRepo.createTag(params.payload);
}
