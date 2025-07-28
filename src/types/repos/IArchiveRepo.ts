import {
  TArchiveEntityType,
  TGetArchiveByIdRespSchema
} from 'src/api/schemas/archive/GetArchiveByIdRespSchema';
import { TTransaction } from '../ITransaction';
import { TCreateArchiveSchema } from 'src/api/schemas/archive/CreateArchiveSchema';

export interface IArchiveRepo {
  createArchiveEntry(
    data: TCreateArchiveSchema,
    tx?: TTransaction
  ): Promise<TGetArchiveByIdRespSchema>;
  getArchivesByEntityType(
    entityType: TArchiveEntityType,
    tx?: TTransaction
  ): Promise<Omit<TGetArchiveByIdRespSchema, 'data'>[]>;
  getArchiveById(archiveId: string): Promise<TGetArchiveByIdRespSchema | null>;
  deleteArchiveEntry(archiveId: string, tx?: TTransaction): Promise<boolean>;
}
