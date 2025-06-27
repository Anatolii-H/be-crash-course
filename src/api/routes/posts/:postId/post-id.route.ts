import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { deletePost } from 'src/controllers/posts/delete-post';
import { getPostById } from 'src/controllers/posts/get-post-by-id';
import { updatePost } from 'src/controllers/posts/update-post';
import { UpdatePostReqSchema } from '../../../schemas/posts/UpdatePostReqSchema';
import {
  GetPostByIdRespSchema,
  GetPostByIdRespSchemaExtended
} from '../../../schemas/posts/GetPostByIdRespSchema';
import { postsPermissionHook } from 'src/api/hooks/posts-permission.hook';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: GetPostByIdRespSchemaExtended
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
      },
      preHandler: postsPermissionHook
    },
    async (request) => {
      return updatePost({
        postsRepo: fastify.repos.postsRepo,
        payload: request.body,
        postId: request.params.postId,
        authorId: request.profile?.id as string
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
      },
      preHandler: postsPermissionHook
    },
    async (request, reply) => {
      await deletePost({ postsRepo: fastify.repos.postsRepo, postId: request.params.postId });

      reply.code(204);
    }
  );
};

export default routes;
