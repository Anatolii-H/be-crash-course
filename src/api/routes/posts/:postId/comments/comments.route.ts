import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { getCommentsByPostId } from 'src/controllers/comments/get-comments';
import { createComment } from 'src/controllers/comments/create-comment';
import { GetCommentByIdRespSchema } from 'src/api/schemas/comments/GetCommentByIdRespSchema';
import { CreateCommentReqSchema } from 'src/api/schemas/comments/CreateCommentReqSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post(
    '/',
    {
      schema: {
        params: z.object({
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
        postId: request.params.postId,
        authorId: request.profile?.id as string,
        uuidService: fastify.uuid,
        usersRepo: fastify.repos.usersRepo
      });

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
        params: z.object({
          postId: z.string().uuid()
        })
      }
    },
    async (request) => {
      return getCommentsByPostId({
        commentsRepo: fastify.repos.commentsRepo,
        postId: request.params.postId
      });
    }
  );
};

export default routes;
