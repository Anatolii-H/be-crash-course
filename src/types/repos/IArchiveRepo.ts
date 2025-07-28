import { TTransaction } from '../ITransaction';

export interface IArchiveRepo {
  createArchiveEntry(data: any, tx?: TTransaction): Promise<any>;
  getArchivedUsers(tx?: TTransaction): Promise<any[]>;
  getArchiveEntry(archiveId: string, tx?: TTransaction): Promise<any | null>;
  deleteArchiveEntry(archiveId: string, tx?: TTransaction): Promise<boolean>;
}
