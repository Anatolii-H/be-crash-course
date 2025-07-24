import { ExtractTablesWithRelations } from 'drizzle-orm';
import { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import { PgTransaction } from 'drizzle-orm/pg-core';

export interface ITransactionManager {
  execute<T>(
    runnable: (ctx: { rollback: () => Promise<void>; sharedTx: TTransaction }) => Promise<T>
  ): Promise<T>;
}

export type TTransactionContext = Parameters<ITransactionManager['execute']>[0] extends (
  ctx: infer T
) => any
  ? T
  : never;

export type TTransaction = PgTransaction<
  NodePgQueryResultHKT,
  Record<string, never>,
  ExtractTablesWithRelations<Record<string, never>>
>;
