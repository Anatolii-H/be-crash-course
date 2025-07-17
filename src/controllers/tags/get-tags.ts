import { ITagsRepo } from 'src/types/repos/ITagsRepo';

export async function getTags(params: { tagsRepo: ITagsRepo }) {
  return params.tagsRepo.getTags();
}
