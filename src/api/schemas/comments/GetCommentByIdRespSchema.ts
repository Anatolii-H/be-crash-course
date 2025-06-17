import { z } from 'zod';

export const GetCommentByIdRespSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  authorId: z.string().uuid().nullable()
});

export type TGetCommentByIdRespSchema = z.infer<typeof GetCommentByIdRespSchema>;
