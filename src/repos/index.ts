import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { getPostsRepo } from './posts.repo';
import { getCommentsRepo } from './comments.repo';

export function getRepos(db: NodePgDatabase) {
  return {
    postsRepo: getPostsRepo(db),
    commentsRepo: getCommentsRepo(db)
  };
}

export type IRepos = ReturnType<typeof getRepos>;
