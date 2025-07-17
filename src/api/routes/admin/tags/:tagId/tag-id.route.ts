import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { GetTagByIdRespSchema } from 'src/api/schemas/tags/GetTagByIdRespSchema';
import { UpdateTagReqSchema } from 'src/api/schemas/tags/UpdateTagByIdReqSchema';
import { updateTag } from 'src/controllers/tags/update-tag';
import { deleteTag } from 'src/controllers/tags/delete-tag';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.patch(
    '/',
    {
      schema: {
        params: z.object({
          tagId: z.string().uuid()
        }),
        body: UpdateTagReqSchema,
        response: {
          200: GetTagByIdRespSchema
        }
      }
    },
    async (request) => {
      return updateTag({
        tagsRepo: fastify.repos.tagsRepo,
        payload: request.body,
        tagId: request.params.tagId
      });
    }
  );

  fastify.delete(
    '/',
    {
      schema: {
        params: z.object({
          tagId: z.string().uuid()
        })
      }
    },
    async (request, reply) => {
      await deleteTag({ tagsRepo: fastify.repos.tagsRepo, tagId: request.params.tagId });

      reply.code(204);
    }
  );
};

export default routes;
