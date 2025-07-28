import { z } from 'zod';

export const ArchiveEntityType = z.enum(['user']);

export const GetArchiveByIdRespSchema = z.object({
  id: z.string().uuid(),
  archivedAt: z.date(),
  entityType: ArchiveEntityType,
  entityId: z.string().uuid(),
  data: z.record(z.string(), z.unknown())
});

export const GetArchivesQueries = z.object({
  entityType: ArchiveEntityType
});

export const GetArchiveByIdRespSchemaWithoutData = GetArchiveByIdRespSchema.omit({ data: true });

export type TGetArchivesQueries = z.infer<typeof GetArchivesQueries>;
export type TArchiveEntityType = z.infer<typeof ArchiveEntityType>;
export type TGetArchiveByIdRespSchema = z.infer<typeof GetArchiveByIdRespSchema>;
export type TGetArchiveByIdRespSchemaWithoutData = z.infer<
  typeof GetArchiveByIdRespSchemaWithoutData
>;
