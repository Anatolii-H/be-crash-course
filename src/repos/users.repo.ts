import { eq, getTableColumns, or, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { users } from 'src/services/drizzle/schema';
import {
  UserSchema,
  UserSchemaExtendedMetadata
} from 'src/api/schemas/users/GetUserByIdRespSchema';

import { IUsersRepo } from 'src/types/repos/IUsersRepo';

export function getUsersRepo(db: NodePgDatabase): IUsersRepo {
  return {
    async createUser(payload, sub: string) {
      const [createdUser] = await db
        .insert(users)
        .values({ ...payload, sub })
        .returning();

      return UserSchema.parse(createdUser);
    },

    async getUserById(id: string) {
      const [user] = await db.select().from(users).where(eq(users.id, id));

      if (!user) {
        return null;
      }

      return UserSchema.parse(user);
    },

    async getUserByEmail(email: string) {
      const [user] = await db.select().from(users).where(eq(users.email, email));

      if (!user) {
        return null;
      }

      return UserSchema.parse(user);
    },

    async getUserBySubId(subId: string) {
      const [user] = await db.select().from(users).where(eq(users.sub, subId));

      if (!user) {
        return null;
      }

      return UserSchema.parse(user);
    },

    async getUsers(queries) {
      const { page, pageSize, search } = queries;

      const whereSearchClause =
        search && search.trim() !== ''
          ? or(
              sql`similarity(${users.firstName}, ${search}) > 0.1`,
              sql`similarity(${users.lastName}, ${search}) > 0.1`,
              sql`similarity(${users.email}, ${search}) > 0.1`
            )
          : undefined;

      const usersList = await db
        .select({
          ...getTableColumns(users),
          totalCount: sql<number>`cast(count(*) over() as int)`
        })
        .from(users)
        .where(whereSearchClause)
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const totalCount = usersList[0]?.totalCount ?? 0;

      return UserSchemaExtendedMetadata.parse({
        data: usersList,
        meta: {
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
          page,
          pageSize
        }
      });
    },

    async updateUser(userId, payload) {
      const [updatedUser] = await db
        .update(users)
        .set(payload)
        .where(eq(users.id, userId))
        .returning();

      if (!updatedUser) {
        return null;
      }

      return UserSchema.parse(updatedUser);
    }
  };
}
