import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { getUsers } from 'src/controllers/users/get-users';
import {
  GetUsersReqQueries,
  UserSchemaExtendedMetadata
} from 'src/api/schemas/users/GetUserByIdRespSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get(
    '/',
    {
      schema: {
        querystring: GetUsersReqQueries,
        response: {
          200: UserSchemaExtendedMetadata
        }
      }
    },
    async (request) => {
      return getUsers({
        usersRepo: fastify.repos.usersRepo,
        queries: request.query
      });
    }
  );
};

export default routes;
