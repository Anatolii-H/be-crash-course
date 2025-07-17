import { z } from 'zod';

export const UpdatePostReqSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  tagIds: z.array(z.string())
});

export type TUpdatePostReqSchema = z.infer<typeof UpdatePostReqSchema>;
