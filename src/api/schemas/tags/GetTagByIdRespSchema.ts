import { z } from 'zod';

export const GetTagByIdRespSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type TGetTagByIdRespSchema = z.infer<typeof GetTagByIdRespSchema>;
