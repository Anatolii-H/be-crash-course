import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { disableUser } from 'src/controllers/common/disable-user';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post(
    '/',
    {
      schema: {
        params: z.object({
          userId: z.string().uuid()
        }),
        response: {
          200: z.boolean()
        }
      }
    },
    async (request) => {
      return disableUser({
        identityService: fastify.identityService,
        usersRepo: fastify.repos.usersRepo,
        userId: request.params.userId,
        requestUserId: request.profile?.id as string
      });
    }
  );
};

export default routes;
