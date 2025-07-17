import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { getPostsRepo } from './posts.repo';
import { getCommentsRepo } from './comments.repo';
import { getUsersRepo } from './users.repo';
import { getTagsRepo } from './tags.repo';

export function getRepos(db: NodePgDatabase) {
  return {
    postsRepo: getPostsRepo(db),
    commentsRepo: getCommentsRepo(db),
    usersRepo: getUsersRepo(db),
    tagsRepo: getTagsRepo(db)
  };
}

export type IRepos = ReturnType<typeof getRepos>;
