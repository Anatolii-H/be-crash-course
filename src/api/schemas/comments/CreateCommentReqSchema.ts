import { z } from 'zod';

export const CreateCommentReqSchema = z.object({
  text: z.string()
});

export type TCreateCommentReqSchema = z.infer<typeof CreateCommentReqSchema>;
