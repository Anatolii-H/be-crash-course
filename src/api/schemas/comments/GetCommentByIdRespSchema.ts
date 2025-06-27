import { z } from 'zod';

import { UserSchema } from '../users/GetUserByIdRespSchema';

export const GetCommentByIdRespSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  authorId: z.string().uuid().nullable()
});

export const GetCommentByIdRespSchemaExtended = GetCommentByIdRespSchema.omit({
  authorId: true
}).extend({
  author: UserSchema
});

export type TGetCommentByIdRespSchema = z.infer<typeof GetCommentByIdRespSchema>;
export type TGetCommentByIdRespSchemaExtended = z.infer<typeof GetCommentByIdRespSchemaExtended>;
