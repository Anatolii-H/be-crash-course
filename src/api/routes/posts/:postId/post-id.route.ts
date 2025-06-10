import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { deletePost } from 'src/controllers/posts/delete-post';
import { getPostById } from 'src/controllers/posts/get-post-by-id';
import { updatePost } from 'src/controllers/posts/update-post';
import { UpdatePostReqSchema } from '../../../schemas/posts/UpdatePostReqSchema';
import {
  GetPostByIdRespSchema,
  GetPostByIdRespSchemaExtendedComments
} from '../../../schemas/posts/GetPostByIdRespSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: GetPostByIdRespSchemaExtendedComments
        },
        params: z.object({
          postId: z.string().uuid()
        })
      }
    },
    async (request) => {
      return getPostById({ postsRepo: fastify.repos.postsRepo, postId: request.params.postId });
    }
  );

  fastify.patch(
    '/',
    {
      schema: {
        params: z.object({
          postId: z.string().uuid()
        }),
        body: UpdatePostReqSchema,
        response: {
          200: GetPostByIdRespSchema
        }
      }
    },
    async (request) => {
      return updatePost({
        postsRepo: fastify.repos.postsRepo,
        payload: request.body,
        postId: request.params.postId
      });
    }
  );

  fastify.delete(
    '/',
    {
      schema: {
        params: z.object({
          postId: z.string().uuid()
        })
      }
    },
    async (request, reply) => {
      await deletePost({ postsRepo: fastify.repos.postsRepo, postId: request.params.postId });

      reply.code(204);
    }
  );
};

export default routes;
