import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { updateComment } from 'src/controllers/comments/update-comment';
import { deleteComment } from 'src/controllers/comments/delete-comment';
import { UpdateCommentReqSchema } from 'src/api/schemas/comments/UpdateCommentReqSchema';
import { GetCommentByIdRespSchema } from 'src/api/schemas/comments/GetCommentByIdRespSchema';
import { commentsPermissionHook } from 'src/api/hooks/comments-permission.hook';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.patch(
    '/',
    {
      schema: {
        response: {
          200: GetCommentByIdRespSchema
        },
        params: z.object({
          commentId: z.string().uuid(),
          postId: z.string().uuid()
        }),
        body: UpdateCommentReqSchema
      },
      preHandler: commentsPermissionHook
    },
    async (request) => {
      return updateComment({
        commentsRepo: fastify.repos.commentsRepo,
        payload: request.body,
        commentId: request.params.commentId
      });
    }
  );

  fastify.delete(
    '/',
    {
      schema: {
        params: z.object({
          commentId: z.string().uuid(),
          postId: z.string().uuid()
        })
      },
      preHandler: commentsPermissionHook
    },
    async (request, reply) => {
      await deleteComment({
        commentsRepo: fastify.repos.commentsRepo,
        commentId: request.params.commentId
      });

      reply.code(204);
    }
  );
};

export default routes;
