import { z } from 'zod';

import { ArchiveEntityType } from './GetArchiveByIdRespSchema';

export const CreateArchiveSchema = z.object({
  entityType: ArchiveEntityType,
  entityId: z.string().uuid(),
  data: z.record(z.string(), z.unknown())
});

export type TCreateArchiveSchema = z.infer<typeof CreateArchiveSchema>;
