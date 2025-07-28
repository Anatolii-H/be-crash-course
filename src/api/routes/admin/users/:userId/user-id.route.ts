import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { deleteUser } from 'src/controllers/users/delete-user';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.delete(
    '/',
    {
      schema: {
        params: z.object({
          userId: z.string().uuid()
        })
      }
    },
    async (request) => {
      await deleteUser({
        archiveRepo: fastify.repos.archiveRepo,
        commentsRepo: fastify.repos.commentsRepo,
        identityService: fastify.identityService,
        postsRepo: fastify.repos.postsRepo,
        transactionManager: fastify.transactionManager,
        userId: request.params.userId,
        requestUserId: request.profile?.id as string,
        usersRepo: fastify.repos.usersRepo
      });
    }
  );
};

export default routes;
