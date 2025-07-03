import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { AcceptInviteReqSchema } from 'src/api/schemas/auth/AcceptInviteReqSchema';
import { acceptInvite } from 'src/controllers/auth/accept-invite';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post(
    '/',
    {
      schema: {
        body: AcceptInviteReqSchema
      },
      config: {
        skipAuth: true
      }
    },
    async (request) => {
      await acceptInvite({
        data: request.body,
        identityService: fastify.identityService,
        signatureService: fastify.signatureService,
        userProfilesRepo: fastify.repos.usersRepo
      });
    }
  );
};

export default routes;
