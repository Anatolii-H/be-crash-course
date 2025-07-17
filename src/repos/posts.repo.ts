import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  gt,
  gte,
  inArray,
  ne,
  or,
  sql
} from 'drizzle-orm';

import { IPostsRepo } from 'src/types/repos/IPostsRepo';
import { posts, postsToTags, tags, users } from 'src/services/drizzle/schema';
import { comments } from 'src/services/drizzle/schema';
import {
  GetPostByIdRespSchema,
  GetPostByIdRespSchemaExtended,
  GetPostByIdRespSchemaExtendedMetadata
} from 'src/api/schemas/posts/GetPostByIdRespSchema';
import { TGetTagByIdRespSchema } from 'src/api/schemas/tags/GetTagByIdRespSchema';

export function getPostsRepo(db: NodePgDatabase): IPostsRepo {
  return {
    async createPost(payload, authorId) {
      const [newPost] = await db.transaction(async (tx) => {
        const [createdPost] = await tx
          .insert(posts)
          .values({ ...payload, authorId })
          .returning();

        if (payload.tagIds.length > 0) {
          const tagsToInsert = payload.tagIds.map((tagId) => ({
            postId: createdPost.id,
            tagId
          }));

          await tx.insert(postsToTags).values(tagsToInsert);
        }

        return [createdPost];
      });

      return GetPostByIdRespSchema.parse(newPost);
    },

    async getPostById(postId) {
      const results = await db
        .select()
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .where(eq(posts.id, postId));

      if (!results.length) {
        return null;
      }

      const { posts: postData, users: authorData } = results[0];

      if (!authorData) {
        return null;
      }

      const commentsForPost = await db
        .select()
        .from(comments)
        .leftJoin(users, eq(comments.authorId, users.id))
        .where(eq(comments.postId, postId));

      const commentsWithAuthors = commentsForPost.map((result) => {
        const { comments: commentData, users: commentAuthorData } = result;

        return {
          ...commentData,
          author: commentAuthorData
        };
      });

      const tagsForPost = await db
        .select({ ...getTableColumns(tags) })
        .from(tags)
        .innerJoin(postsToTags, eq(tags.id, postsToTags.tagId))
        .where(eq(postsToTags.postId, postId));

      return GetPostByIdRespSchemaExtended.parse({
        ...postData,
        author: authorData,
        comments: commentsWithAuthors,
        tags: tagsForPost
      });
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
        minCommentsCount,
        tagIds
      } = queries;

      const sortFields = {
        title: posts.title,
        createdAt: posts.createdAt,
        commentsCount: count(comments.id)
      };

      const isCursorPagination = cursorCreatedAt && cursorId;

      const havingClause = minCommentsCount ? gte(count(comments.id), minCommentsCount) : undefined;

      const whereSearchClause = search?.trim()
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
        .leftJoin(comments, eq(comments.postId, posts.id))
        .leftJoin(postsToTags, eq(posts.id, postsToTags.postId))
        .where(and(whereClause, tagIds?.length ? inArray(postsToTags.tagId, tagIds) : undefined))
        .groupBy(posts.id)
        .having(havingClause)
        .orderBy(orderByClause)
        .limit(pageSize)
        .offset(isCursorPagination ? 0 : (page - 1) * pageSize);

      const totalCount = postsList[0]?.totalCount ?? 0;

      const postIds = postsList.map((p) => p.id);

      if (!postIds.length) {
        return GetPostByIdRespSchemaExtendedMetadata.parse({
          data: [],
          meta: {
            totalCount: 0,
            totalPages: 0,
            page,
            pageSize
          }
        });
      }

      const tagsForPosts = await db
        .select({
          postId: postsToTags.postId,
          ...getTableColumns(tags)
        })
        .from(postsToTags)
        .innerJoin(tags, eq(tags.id, postsToTags.tagId))
        .where(inArray(postsToTags.postId, postIds));

      const tagsMap = new Map<string, TGetTagByIdRespSchema[]>();

      for (const row of tagsForPosts) {
        const { postId, ...tag } = row;

        if (!tagsMap.has(postId)) {
          tagsMap.set(postId, []);
        }

        tagsMap.get(postId)!.push(tag);
      }

      const enrichedPosts = postsList.map((post) => ({
        ...post,
        tags: tagsMap.get(post.id) ?? []
      }));

      return GetPostByIdRespSchemaExtendedMetadata.parse({
        data: enrichedPosts,
        meta: {
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
          page,
          pageSize
        }
      });
    },

    async updatePost(payload, postId) {
      const { tagIds, ...postPayload } = payload;

      const [updatedPost] = await db.transaction(async (tx) => {
        const [updated] = await tx
          .update(posts)
          .set(postPayload)
          .where(eq(posts.id, postId))
          .returning();

        if (!updated) {
          tx.rollback();

          return [];
        }

        await tx.delete(postsToTags).where(eq(postsToTags.postId, postId));

        if (tagIds.length > 0) {
          const tagsToInsert = tagIds.map((tagId) => ({
            postId,
            tagId
          }));

          await tx.insert(postsToTags).values(tagsToInsert);
        }

        return [updated];
      });

      if (!updatedPost) {
        return null;
      }

      return GetPostByIdRespSchema.parse(updatedPost);
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
