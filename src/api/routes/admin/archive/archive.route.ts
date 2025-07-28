import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import {
  GetArchiveByIdRespSchemaWithoutData,
  GetArchivesQueries
} from 'src/api/schemas/archive/GetArchiveByIdRespSchema';
import { getArchivesByEntityType } from 'src/controllers/archive/get-archives-by-entity-type';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get(
    '/',
    {
      schema: {
        querystring: GetArchivesQueries,
        response: {
          200: z.array(GetArchiveByIdRespSchemaWithoutData)
        }
      }
    },
    async (request) => {
      return getArchivesByEntityType({
        archiveRepo: fastify.repos.archiveRepo,
        queries: request.query
      });
    }
  );
};

export default routes;
