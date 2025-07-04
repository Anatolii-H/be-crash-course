import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { getUserById } from 'src/controllers/users/get-user-by-id';
import { UserSchema } from 'src/api/schemas/users/GetUserByIdRespSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: UserSchema
        }
      }
    },
    async (request) => {
      return getUserById({
        usersRepo: fastify.repos.usersRepo,
        userId: request.profile?.id as string
      });
    }
  );
};

export default routes;
