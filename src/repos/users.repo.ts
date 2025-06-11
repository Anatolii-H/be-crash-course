import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { users } from 'src/services/drizzle/schema';

import { IUsersRepo } from 'src/types/entities/IUsersRepo';

export function getUsersRepo(db: NodePgDatabase): IUsersRepo {
  return {
    async createUser(payload, sub: string) {
      const [createdUser] = await db
        .insert(users)
        .values({ ...payload, sub })
        .returning();

      return createdUser;
    },

    async getUserById(id: string) {
      const [user] = await db.select().from(users).where(eq(users.id, id));

      if (!user) {
        return null;
      }

      return user;
    },

    async getUserBySubId(subId: string) {
      const [user] = await db.select().from(users).where(eq(users.sub, subId));

      if (!user) {
        return null;
      }

      return user;
    }
  };
}
