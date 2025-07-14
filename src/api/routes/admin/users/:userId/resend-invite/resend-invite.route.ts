import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { concatenateUrlParts } from 'src/api/helpers';
import { resendEmailInvite } from 'src/controllers/users/resend-email-invite';

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
      await resendEmailInvite({
        baseUrl: concatenateUrlParts({
          baseUrl: process.env.FRONTEND_BASE_URL,
          path: process.env.FRONTEND_RESET_PASSWORD_URL
        }),
        emailTemplateId: process.env.RESET_PASSWORD_TEMPLATE_ID,
        fromEmail: process.env.FROM_EMAIL,
        mailService: fastify.mailService,
        signatureService: fastify.signatureService,
        tokenTTLInMillis: process.env.RESET_PASSWORD_TOKEN_TTL_MS,
        userProfilesRepo: fastify.repos.usersRepo,
        userId: request.params.userId
      });
    }
  );
};

export default routes;
