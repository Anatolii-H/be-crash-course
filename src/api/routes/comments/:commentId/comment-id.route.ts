import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { updateComment } from 'src/controllers/comments/update-comment';
import { deleteComment } from 'src/controllers/comments/delete-comment';
import { UpdateCommentReqSchema } from '../../../schemas/comments/UpdateCommentReqSchema';
import { GetCommentByIdRespSchema } from '../../../schemas/comments/GetCommentByIdRespSchema';

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
          commentId: z.string().uuid()
        }),
        body: UpdateCommentReqSchema
      }
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
          commentId: z.string().uuid()
        })
      }
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
