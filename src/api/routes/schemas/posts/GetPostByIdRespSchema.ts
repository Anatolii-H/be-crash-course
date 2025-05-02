import { z } from 'zod';

import { GetCommentByIdRespSchema } from '../comments/GetCommentByIdRespSchema';

export const GetPostByIdRespSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const GetPostByIdRespSchemaExtended = GetPostByIdRespSchema.extend({
  comments: z.array(GetCommentByIdRespSchema)
});

export const GetPostsReqQueries = z
  .object({
    page: z.coerce.number().min(1).optional().default(1),
    pageSize: z.coerce.number().min(1).max(50).optional().default(5),
    cursorCreatedAt: z.coerce.date().optional(),
    cursorId: z.string().uuid().optional(),
    search: z.string().optional().default(''),
    sortBy: z.enum(['title', 'createdAt', 'commentsCount']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    minCommentsCount: z.coerce.number().min(0).optional()
  })
  .refine(
    (data) => {
      const hasCursorCreatedAt = Boolean(data.cursorCreatedAt);
      const hasCursorId = Boolean(data.cursorId);

      return !(hasCursorCreatedAt !== hasCursorId);
    },
    {
      message: 'Both cursorCreatedAt and cursorId must be provided together.'
    }
  );

export type TGetPostByIdRespSchema = z.infer<typeof GetPostByIdRespSchema>;
export type TGetPostByIdRespSchemaExtended = z.infer<typeof GetPostByIdRespSchemaExtended>;
export type TGetPostsReqQueries = z.infer<typeof GetPostsReqQueries>;
