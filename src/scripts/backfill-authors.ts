import { isNull, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { getDb } from 'src/services/drizzle/drizzle.service';
import { posts, comments, users } from 'src/services/drizzle/schema';

function getDbConnection() {
  return getDb({
    host: process.env.PGHOST || '',
    port: parseInt(process.env.PGPORT || ''),
    db: process.env.PGDATABASE || '',
    user: process.env.PGUSERNAME || '',
    pwd: process.env.PGPASSWORD || '',
    logsEnabled: process.env.NODE_ENV == 'local'
  });
}

function getPostsWithoutAuthor(db: NodePgDatabase) {
  return db.select().from(posts).where(isNull(posts.authorId));
}

function getCommentsWithoutAuthor(db: NodePgDatabase) {
  return db.select().from(comments).where(isNull(comments.authorId));
}

function getAllUsers(db: NodePgDatabase) {
  return db.select().from(users);
}

async function main() {
  console.log('🚀 Starting backfill script...');

  const db = getDbConnection();

  if (!db) {
    console.error('❌ Failed to get DB connection.');

    process.exit(1);
  }

  console.log('✅ DB initialized.');

  const allUsers = await getAllUsers(db);

  const userIds = allUsers.map((u) => u.id);

  console.log(`👤 Found ${userIds.length} users.`);

  if (userIds.length === 0) {
    console.error('❌ No test users available. Exiting.');

    return;
  }

  const postsWithoutAuthor = await getPostsWithoutAuthor(db);

  console.log(`📄 Found ${postsWithoutAuthor.length} posts to update.`);

  for (let i = 0; i < postsWithoutAuthor.length; i++) {
    const post = postsWithoutAuthor[i];
    const userIdToAssign = userIds[i % userIds.length];

    await db
      .update(posts)
      .set({ authorId: userIdToAssign })
      .where(eq(posts.id, post.id))
      .returning();

    console.log(`Updated post ${post.id} with author ${userIdToAssign}`);
  }

  const commentsWithoutAuthor = await getCommentsWithoutAuthor(db);
  console.log(`💬 Found ${commentsWithoutAuthor.length} comments to update.`);

  for (let i = 0; i < commentsWithoutAuthor.length; i++) {
    const comment = commentsWithoutAuthor[i];
    const userIdToAssign = userIds[i % userIds.length];

    await db
      .update(comments)
      .set({ authorId: userIdToAssign })
      .where(eq(comments.id, comment.id))
      .returning();

    console.log(`Updated comment ${comment.id} with author ${userIdToAssign}`);
  }

  console.log('✅ Backfill script finished successfully!');

  process.exit(0);
}

main().catch((e) => {
  console.error('❌ An error occurred during the backfill process:');
  console.error(e);
  process.exit(1);
});
