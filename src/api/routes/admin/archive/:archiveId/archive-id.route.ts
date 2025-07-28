import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { getArchiveById } from 'src/controllers/archive/get-archive-by-id';

import { GetArchiveByIdRespSchema } from 'src/api/schemas/archive/GetArchiveByIdRespSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get(
    '/',
    {
      schema: {
        params: z.object({
          archiveId: z.string().uuid()
        }),
        response: {
          200: GetArchiveByIdRespSchema
        }
      }
    },
    async (request) => {
      return getArchiveById({
        archiveRepo: fastify.repos.archiveRepo,
        archiveId: request.params.archiveId
      });
    }
  );
};

export default routes;
