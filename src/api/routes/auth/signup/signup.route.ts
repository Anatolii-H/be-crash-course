import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { SignupReqSchema } from 'src/api/schemas/auth/SignupReqSchema';
import { SignupRespSchema } from 'src/api/schemas/auth/SignupRespSchema';
import { createUser } from 'src/controllers/auth/create-user';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post(
    '/',
    {
      schema: {
        response: {
          201: SignupRespSchema
        },
        body: SignupReqSchema
      },
      config: {
        skipAuth: true
      }
    },
    async (request, reply) => {
      const createdUser = await createUser({
        usersRepo: fastify.repos.usersRepo,
        identityService: fastify.identityService,
        payload: request.body
      });

      reply.code(201).send(createdUser);
    }
  );
};

export default routes;
