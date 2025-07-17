import { z } from 'zod';

export const CreatePostReqSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  tagIds: z.array(z.string())
});

export type TCreatePostReqSchema = z.infer<typeof CreatePostReqSchema>;
