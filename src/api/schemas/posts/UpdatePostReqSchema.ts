import { z } from 'zod';

export const UpdatePostReqSchema = z.object({
  title: z.string(),
  description: z.string().optional()
});

export type TUpdatePostReqSchema = z.infer<typeof UpdatePostReqSchema>;
