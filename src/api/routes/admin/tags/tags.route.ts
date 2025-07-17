import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { GetTagByIdRespSchema } from 'src/api/schemas/tags/GetTagByIdRespSchema';
import { createTag } from 'src/controllers/tags/create-tag';
import { CreateTagReqSchema } from 'src/api/schemas/tags/CreateTagReqSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post(
    '/',
    {
      schema: {
        response: {
          201: GetTagByIdRespSchema
        },
        body: CreateTagReqSchema
      }
    },
    async (request) => {
      return createTag({ tagsRepo: fastify.repos.tagsRepo, payload: request.body });
    }
  );
};

export default routes;
