import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { GetTagByIdRespSchema } from 'src/api/schemas/tags/GetTagByIdRespSchema';
import { getTags } from 'src/controllers/tags/get-tags';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: z.array(GetTagByIdRespSchema)
        }
      }
    },
    async () => {
      return getTags({ tagsRepo: fastify.repos.tagsRepo });
    }
  );
};

export default routes;
