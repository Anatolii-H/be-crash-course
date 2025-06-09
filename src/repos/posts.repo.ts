import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, asc, count, desc, eq, getTableColumns, gt, gte, ne, or, sql } from 'drizzle-orm';

import { IPostsRepo } from 'src/types/entities/IPostsRepo';
import { posts } from 'src/services/drizzle/schema';
import { comments } from 'src/services/drizzle/schema';

export function getPostsRepo(db: NodePgDatabase): IPostsRepo {
  return {
    async createPost(payload) {
      const [createdPost] = await db.insert(posts).values(payload).returning();

      return createdPost;
    },

    async getPostById(postId) {
      const [post] = await db.select().from(posts).where(eq(posts.id, postId));

      if (!post) {
        return null;
      }

      const commentsForPost = await db.select().from(comments).where(eq(comments.postId, postId));

      return {
        ...post,
        comments: commentsForPost
      };
    },

    async getPosts(queries) {
      const {
        page,
        pageSize,
        search,
        cursorCreatedAt,
        cursorId,
        sortBy,
        sortOrder,
        minCommentsCount
      } = queries;

      const sortFields = {
        title: posts.title,
        createdAt: posts.createdAt,
        commentsCount: count(comments.id)
      };

      const isCursorPagination = cursorCreatedAt && cursorId;

      const havingClause = minCommentsCount ? gte(count(comments.id), minCommentsCount) : undefined;

      const whereSearchClause =
        search && search.trim() !== ''
          ? or(
              sql`similarity(${posts.title}, ${search}) > 0.1`,
              sql`similarity(${posts.description}, ${search}) > 0.1`
            )
          : undefined;

      const whereCursorPaginationClause = isCursorPagination
        ? or(
            and(gt(posts.createdAt, cursorCreatedAt), ne(posts.id, cursorId)),
            and(eq(posts.createdAt, cursorCreatedAt), gt(posts.id, cursorId))
          )
        : undefined;

      const whereClause = isCursorPagination
        ? and(whereSearchClause, whereCursorPaginationClause)
        : whereSearchClause;

      const sortColumn = sortFields[sortBy || 'createdAt'];
      const orderByClause = sortOrder === 'desc' ? desc(sortColumn) : asc(sortColumn);

      const postsList = await db
        .select({
          ...getTableColumns(posts),
          commentsCount: count(comments.id),
          totalCount: sql<number>`cast(count(*) over() as int)`
        })
        .from(posts)
        .where(whereClause)
        .leftJoin(comments, eq(comments.postId, posts.id))
        .groupBy(posts.id)
        .having(havingClause)
        .orderBy(orderByClause)
        .limit(pageSize)
        .offset(isCursorPagination ? 0 : (page - 1) * pageSize);

      const totalCount = postsList[0]?.totalCount ?? 0;

      return {
        data: postsList,
        meta: {
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
          page,
          pageSize
        }
      };
    },

    async updatePost(payload, postId) {
      const [updatedPost] = await db
        .update(posts)
        .set(payload)
        .where(eq(posts.id, postId))
        .returning();

      if (!updatedPost) {
        return null;
      }

      return updatedPost;
    },

    async deletePost(postId) {
      const [deletedPost] = await db
        .delete(posts)
        .where(eq(posts.id, postId))
        .returning({ id: posts.id });

      if (!deletedPost) {
        return null;
      }

      return deletedPost.id;
    }
  };
}
