import { TCreateTagReqSchema } from 'src/api/schemas/tags/CreateTagReqSchema';
import { TGetTagByIdRespSchema } from 'src/api/schemas/tags/GetTagByIdRespSchema';
import { TUpdateTagReqSchema } from 'src/api/schemas/tags/UpdateTagByIdReqSchema';

export interface ITagsRepo {
  createTag(payload: TCreateTagReqSchema): Promise<TGetTagByIdRespSchema>;
  getTagById(tagId: string): Promise<TGetTagByIdRespSchema | null>;
  getTags(): Promise<TGetTagByIdRespSchema[]>;
  updateTag(tagId: string, payload: TUpdateTagReqSchema): Promise<TGetTagByIdRespSchema | null>;
  deleteTag(tagId: string): Promise<boolean>;
}
