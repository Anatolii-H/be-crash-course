import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { GetTagByIdRespSchema } from 'src/api/schemas/tags/GetTagByIdRespSchema';
import { getTagById } from 'src/controllers/tags/get-tag-by-id';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: GetTagByIdRespSchema
        },
        params: z.object({
          tagId: z.string().uuid()
        })
      }
    },
    async (request) => {
      return getTagById({ tagsRepo: fastify.repos.tagsRepo, tagId: request.params.tagId });
    }
  );
};

export default routes;
