import { TCreateTagReqSchema } from 'src/api/schemas/tags/CreateTagReqSchema';
import { TGetTagByIdRespSchema } from 'src/api/schemas/tags/GetTagByIdRespSchema';
import { TUpdateTagReqSchema } from 'src/api/schemas/tags/UpdateTagByIdReqSchema';
import { TTransaction } from '../ITransaction';

export interface ITagsRepo {
  createTag(payload: TCreateTagReqSchema): Promise<TGetTagByIdRespSchema>;
  getTagById(tagId: string): Promise<TGetTagByIdRespSchema | null>;
  getTags(): Promise<TGetTagByIdRespSchema[]>;
  updateTag(tagId: string, payload: TUpdateTagReqSchema): Promise<TGetTagByIdRespSchema | null>;
  deleteTag(tagId: string): Promise<boolean>;
  getExistingTagIds(tagIds: string[], tx?: TTransaction): Promise<{ id: string }[]>;
}
