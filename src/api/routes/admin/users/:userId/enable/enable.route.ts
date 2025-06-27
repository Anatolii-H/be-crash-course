import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { enableUser } from 'src/controllers/users/enable-user';

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
      return enableUser({
        identityService: fastify.identityService,
        usersRepo: fastify.repos.usersRepo,
        userId: request.params.userId
      });
    }
  );
};

export default routes;
