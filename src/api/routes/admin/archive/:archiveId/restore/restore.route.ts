import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { restoreUserFromArchive } from 'src/controllers/archive/restore-user-from-archive';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post(
    '/',
    {
      schema: {
        params: z.object({
          archiveId: z.string().uuid()
        })
      }
    },
    async (request) => {
      return restoreUserFromArchive({
        archiveId: request.params.archiveId,
        archiveRepo: fastify.repos.archiveRepo,
        commentsRepo: fastify.repos.commentsRepo,
        identityService: fastify.identityService,
        postsRepo: fastify.repos.postsRepo,
        postsToTagsRepo: fastify.repos.postsToTagsRepo,
        transactionManager: fastify.transactionManager,
        usersRepo: fastify.repos.usersRepo,
        tagsRepo: fastify.repos.tagsRepo
      });
    }
  );
};

export default routes;
