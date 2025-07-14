import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { UserInviteReqSchema } from 'src/api/schemas/auth/UserInviteReqSchema';
import { createPendingUserAndSendEmailInvite } from 'src/controllers/users/create-pending-user-and-send-email-invite';
import { concatenateUrlParts } from 'src/api/helpers';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post(
    '/',
    {
      schema: {
        body: UserInviteReqSchema
      }
    },
    async (request) => {
      await createPendingUserAndSendEmailInvite({
        baseUrl: concatenateUrlParts({
          baseUrl: process.env.FRONTEND_BASE_URL,
          path: process.env.FRONTEND_RESET_PASSWORD_URL
        }),
        emailTemplateId: process.env.RESET_PASSWORD_TEMPLATE_ID,
        fromEmail: process.env.FROM_EMAIL,
        identityService: fastify.identityService,
        mailService: fastify.mailService,
        signatureService: fastify.signatureService,
        toEmail: request.body.email,
        tokenTTLInMillis: process.env.RESET_PASSWORD_TOKEN_TTL_MS,
        userProfilesRepo: fastify.repos.usersRepo
      });
    }
  );
};

export default routes;
