import { z } from 'zod';

export const PostsToTagsSchema = z.object({
  id: z.string().uuid(),
  postId: z.string().uuid(),
  tagId: z.string().uuid()
});

export const CreatePostsToTagsSchema = z.object({
  postId: z.string().uuid(),
  tagId: z.string().uuid()
});

export type TPostsToTagsSchema = z.infer<typeof PostsToTagsSchema>;
export type TCreatePostsToTagsSchema = z.infer<typeof CreatePostsToTagsSchema>;
