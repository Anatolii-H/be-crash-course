import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, asc, count, desc, eq, getTableColumns, gt, gte, inArray, or, sql } from 'drizzle-orm';

import { IPostsRepo } from 'src/types/entities/IPostsRepo';
import { posts } from 'src/services/drizzle/schema';
import { comments } from 'src/services/drizzle/schema';
import { TGetCommentByIdRespSchema } from 'src/api/routes/schemas/comments/GetCommentByIdRespSchema';
import { TGetPostByIdRespSchema } from 'src/api/routes/schemas/posts/GetPostByIdRespSchema';

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
          ? sql`to_tsvector('english', ${posts.title}) @@ to_tsquery('english', ${search})`
          : undefined;

      const whereCursorPaginationClause = isCursorPagination
        ? or(
            gt(posts.createdAt, cursorCreatedAt),
            and(eq(posts.createdAt, cursorCreatedAt), gt(posts.id, cursorId))
          )
        : undefined;

      const whereClause = isCursorPagination
        ? and(whereSearchClause, whereCursorPaginationClause)
        : whereSearchClause;

      const sortColumn = sortFields[sortBy || 'createdAt'];
      const orderByClause = sortOrder === 'desc' ? desc(sortColumn) : asc(sortColumn);

      const postsList: TGetPostByIdRespSchema[] = await db
        .select({ ...getTableColumns(posts) })
        .from(posts)
        .where(whereClause)
        .leftJoin(comments, eq(comments.postId, posts.id))
        .groupBy(posts.id)
        .having(havingClause)
        .orderBy(orderByClause)
        .limit(pageSize)
        .offset(isCursorPagination ? 0 : (page - 1) * pageSize);

      const postIds = postsList.map(({ id }) => id);

      const commentsList = await db
        .select()
        .from(comments)
        .where(inArray(comments.postId, postIds));

      const commentsMap = commentsList.reduce((map, comment) => {
        if (!map.has(comment.postId)) {
          map.set(comment.postId, []);
        }

        map.get(comment.postId)?.push(comment);

        return map;
      }, new Map<string, TGetCommentByIdRespSchema[]>());

      const result = postsList.map((post) => ({
        ...post,
        comments: commentsMap.get(post.id) ?? []
      }));

      return result;
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
