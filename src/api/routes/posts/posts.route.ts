import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { createPost } from 'src/controllers/posts/create-post';
import { getPosts } from 'src/controllers/posts/get-posts';
import { CreatePostReqSchema } from '../../schemas/posts/CreatePostReqSchema';
import {
  GetPostByIdRespSchema,
  GetPostsReqQueries,
  GetPostByIdRespSchemaExtendedMetadata
} from '../../schemas/posts/GetPostByIdRespSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post(
    '/',
    {
      schema: {
        response: {
          201: GetPostByIdRespSchema
        },
        body: CreatePostReqSchema
      }
    },
    async (request, reply) => {
      const createdPost = await createPost({
        postsRepo: fastify.repos.postsRepo,
        payload: request.body
      });

      reply.code(201).send(createdPost);
    }
  );

  fastify.get(
    '/',
    {
      schema: {
        querystring: GetPostsReqQueries,
        response: {
          200: GetPostByIdRespSchemaExtendedMetadata
        }
      }
    },
    async (request) => {
      return getPosts({ postsRepo: fastify.repos.postsRepo, queries: request.query });
    }
  );
};

export default routes;
