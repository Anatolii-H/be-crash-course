import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { softRestoreUser } from 'src/controllers/users/soft-restore-user';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post(
    '/',
    {
      schema: {
        params: z.object({
          userId: z.string().uuid()
        })
      }
    },
    async (request) => {
      await softRestoreUser({
        commentsRepo: fastify.repos.commentsRepo,
        postsRepo: fastify.repos.postsRepo,
        transactionManager: fastify.transactionManager,
        userId: request.params.userId,
        usersRepo: fastify.repos.usersRepo,
        identityService: fastify.identityService
      });
    }
  );
};

export default routes;
