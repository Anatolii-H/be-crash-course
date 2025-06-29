import { z } from 'zod';

import { GetCommentByIdRespSchemaExtended } from '../comments/GetCommentByIdRespSchema';
import { PaginationMetadataSchema } from 'src/types/IPagination';
import { UserSchema } from '../users/GetUserByIdRespSchema';

export const GetPostByIdRespSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  authorId: z.string().uuid().nullable()
});

export const GetPostByIdRespSchemaExtended = GetPostByIdRespSchema.omit({ authorId: true }).extend({
  author: UserSchema,
  comments: z.array(GetCommentByIdRespSchemaExtended)
});

export const GetPostByIdRespSchemaExtendedMetadata = z.object({
  data: z.array(
    GetPostByIdRespSchema.extend({
      commentsCount: z.number()
    })
  ),
  meta: PaginationMetadataSchema
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
export type TGetPostByIdRespSchemaExtendedMetadata = z.infer<
  typeof GetPostByIdRespSchemaExtendedMetadata
>;
export type TGetPostsReqQueries = z.infer<typeof GetPostsReqQueries>;
