import { and, eq, getTableColumns, isNotNull, isNull, or, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { users } from 'src/services/drizzle/schema';
import {
  UserSchema,
  UserSchemaExtendedMetadata
} from 'src/api/schemas/users/GetUserByIdRespSchema';

import { IUsersRepo } from 'src/types/repos/IUsersRepo';

function isUserNotDeleted() {
  return isNull(users.deletedAt);
}

function isUserDeleted() {
  return isNotNull(users.deletedAt);
}

export function getUsersRepo(db: NodePgDatabase): IUsersRepo {
  return {
    async createUser(payload, sub: string) {
      const [createdUser] = await db
        .insert(users)
        .values({ ...payload, sub })
        .returning();

      return UserSchema.parse(createdUser);
    },

    async getUserById(options) {
      const { userId, skipDeleted, tx } = options;
      const executor = tx || db;

      const [user] = await executor
        .select()
        .from(users)
        .where(and(eq(users.id, userId), !skipDeleted ? isUserNotDeleted() : undefined));

      if (!user) {
        return null;
      }

      return UserSchema.parse(user);
    },

    async getUserByEmail(email: string) {
      const [user] = await db
        .select()
        .from(users)
        .where(and(eq(users.email, email), isUserNotDeleted()));

      if (!user) {
        return null;
      }

      return UserSchema.parse(user);
    },

    async getUserBySubId(subId: string) {
      const [user] = await db
        .select()
        .from(users)
        .where(and(eq(users.sub, subId), isUserNotDeleted()));

      if (!user) {
        return null;
      }

      return UserSchema.parse(user);
    },

    async getUsers(queries) {
      const { page, pageSize, search, softDeletedOnly } = queries;

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
        .where(and(whereSearchClause, softDeletedOnly ? isUserDeleted() : isUserNotDeleted()))
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
        .where(and(eq(users.id, userId), isUserNotDeleted()))
        .returning();

      if (!updatedUser) {
        return null;
      }

      return UserSchema.parse(updatedUser);
    },

    async softDeleteUser(userId, tx) {
      const executor = tx || db;

      const [softDeletedUser] = await executor
        .update(users)
        .set({ deletedAt: new Date(), isDisabled: true })
        .where(eq(users.id, userId))
        .returning();

      return Boolean(softDeletedUser);
    },

    async deleteUser(userId, tx) {
      const executor = tx || db;

      const [hardDeletedUser] = await executor
        .delete(users)
        .where(eq(users.id, userId))
        .returning();

      return Boolean(hardDeletedUser);
    },

    async restoreSoftDeletedUser(userId, tx) {
      const executor = tx || db;

      const [restoredUser] = await executor
        .update(users)
        .set({ deletedAt: null, isDisabled: false })
        .where(eq(users.id, userId))
        .returning();

      return Boolean(restoredUser);
    },

    async getSoftDeletedUsers() {
      const softDeletedUsers = await db.select().from(users).where(isNotNull(users.deletedAt));

      return UserSchema.array().parse(softDeletedUsers);
    }
  };
}
