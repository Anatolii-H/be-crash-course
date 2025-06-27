import { PaginationMetadataSchema } from 'src/types/IPagination';
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  sub: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
  role: z.enum(['admin', 'user']),
  isDisabled: z.boolean()
});

export const UserSchemaExtendedMetadata = z.object({
  data: z.array(UserSchema),
  meta: PaginationMetadataSchema
});

export const GetUsersReqQueries = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  pageSize: z.coerce.number().min(1).max(50).optional().default(5),
  search: z.string().optional().default('')
});

export type TUserSchema = z.infer<typeof UserSchema>;
export type TUserSchemaExtendedMetadata = z.infer<typeof UserSchemaExtendedMetadata>;

export type TGetUsersReqQueries = z.infer<typeof GetUsersReqQueries>;
