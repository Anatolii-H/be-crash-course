import { z } from 'zod';

export const PaginationMetadataSchema = z.object({
  totalCount: z.number(),
  totalPages: z.number(),
  page: z.number(),
  pageSize: z.number()
});

export type TPaginationMetadataSchema = z.infer<typeof PaginationMetadataSchema>;
