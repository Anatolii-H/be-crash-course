import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { getPostsRepo } from './posts.repo';
import { getCommentsRepo } from './comments.repo';
import { getUsersRepo } from './users.repo';

export function getRepos(db: NodePgDatabase) {
  return {
    postsRepo: getPostsRepo(db),
    commentsRepo: getCommentsRepo(db),
    usersRepo: getUsersRepo(db)
  };
}

export type IRepos = ReturnType<typeof getRepos>;
