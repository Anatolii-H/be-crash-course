import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, ilike, inArray } from 'drizzle-orm';

import { IPostsRepo } from 'src/types/entities/IPostsRepo';
import { posts } from 'src/services/drizzle/schema';
import { comments } from 'src/services/drizzle/schema';
import { TGetCommentByIdRespSchema } from 'src/api/routes/schemas/comments/GetCommentByIdRespSchema';

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
      const { page, pageSize, search } = queries;

      const whereClause =
        search && search.trim() !== '' ? ilike(posts.title, `%${search}%`) : undefined;

      const postsList = await db
        .select()
        .from(posts)
        .where(whereClause)
        .limit(pageSize)
        .offset((page - 1) * pageSize);
      const postIds = postsList.map(({ id }) => id);

      const commentsList = await db
        .select()
        .from(comments)
        .where(inArray(comments.postId, postIds));

      const commentsMap = new Map<string, TGetCommentByIdRespSchema[]>();

      commentsList.forEach((comment) => {
        if (!commentsMap.has(comment.postId)) {
          commentsMap.set(comment.postId, []);
        }

        commentsMap.get(comment.postId)?.push(comment);
      });

      const result = postsList.map((post) => ({
        ...post,
        comments: commentsMap.get(post.id) ?? []
      }));

      return result;
    },

    // async getPostById(postId) {
    //   const rows = await db
    //     .select()
    //     .from(posts)
    //     .where(eq(posts.id, postId))
    //     .leftJoin(comments, eq(posts.id, comments.postId));

    //   const post = rows[0]?.posts;

    //   if (!post) {
    //     return null;
    //   }

    //   const postComments = rows.map((row) => row.comments).filter((comment) => comment !== null);

    //   return {
    //     ...post,
    //     comments: postComments
    //   };
    // },

    // async getPosts(queries) {
    //   const rows = await db.select()
    //                        .from(posts)
    //                        .leftJoin(comments, eq(posts.id, comments.postId));

    //   const postsMap = new Map<string, TGetPostByIdRespSchemaExtended>();

    //   rows.forEach((row) => {
    //     const post = row.posts;
    //     const comment = row.comments;

    //     if (!postsMap.has(post.id)) {
    //       postsMap.set(post.id, {
    //         ...post,
    //         comments: []
    //       });
    //     }

    //     if (comment) {
    //       postsMap.get(post.id)?.comments.push(comment);
    //     }
    //   });

    //   return Array.from(postsMap.values());
    // },

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
