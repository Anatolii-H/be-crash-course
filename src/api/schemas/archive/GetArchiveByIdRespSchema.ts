import { z } from 'zod';

export const ArchiveEntityType = z.enum(['user']);

export const GetArchiveByIdRespSchema = z.object({
  id: z.string().uuid(),
  archivedAt: z.date(),
  entityType: ArchiveEntityType,
  entityId: z.string().uuid(),
  data: z.record(z.string(), z.any())
});

export type TArchiveEntityType = z.infer<typeof ArchiveEntityType>;
export type TGetArchiveByIdRespSchema = z.infer<typeof GetArchiveByIdRespSchema>;
