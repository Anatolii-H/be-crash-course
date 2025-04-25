import { z } from 'zod';

export const CreatePostReqSchema = z.object({
  title: z.string(),
  description: z.string().optional()
});

export type TCreatePostReqSchema = z.infer<typeof CreatePostReqSchema>;
