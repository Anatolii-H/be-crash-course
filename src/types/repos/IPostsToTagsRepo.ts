import {
  TCreatePostsToTagsSchema,
  TPostsToTagsSchema
} from 'src/api/schemas/tags/PostsToTagsSchema';
import { TTransaction } from '../ITransaction';

export interface IPostsToTagsRepo {
  createPostsToTagsRelation(
    payload: TCreatePostsToTagsSchema[],
    tx?: TTransaction
  ): Promise<TPostsToTagsSchema[]>;
  deleteTagsForPost(postId: string, tx?: TTransaction): Promise<void>;
}
