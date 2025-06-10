import { z } from 'zod';

export const UpdateCommentReqSchema = z.object({
  text: z.string()
});

export type TUpdateCommentReqSchema = z.infer<typeof UpdateCommentReqSchema>;
