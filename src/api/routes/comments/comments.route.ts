import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { getCommentsByPostId } from 'src/controllers/comments/get-comments';
import { createComment } from 'src/controllers/comments/create-comment';
import { GetCommentByIdRespSchema } from '../schemas/comments/GetCommentByIdRespSchema';
import { CreateCommentReqSchema } from '../schemas/comments/CreateCommentReqSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post(
    '/',
    {
      schema: {
        querystring: z.object({
          postId: z.string().uuid()
        }),
        response: {
          201: GetCommentByIdRespSchema
        },
        body: CreateCommentReqSchema
      }
    },
    async (request, reply) => {
      const createdComment = await createComment({
        commentsRepo: fastify.repos.commentsRepo,
        payload: request.body,
        postId: request.query.postId
      });

      // return createdComment;

      reply.code(201).send(createdComment);
    }
  );

  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: z.array(GetCommentByIdRespSchema)
        },
        querystring: z.object({
          postId: z.string().uuid()
        })
      }
    },
    async (request) => {
      return getCommentsByPostId({
        commentsRepo: fastify.repos.commentsRepo,
        postId: request.query.postId
      });
    }
  );
};

export default routes;
