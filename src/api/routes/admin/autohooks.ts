import { FastifyPluginAsync } from 'fastify';

import { adminOnlyHook } from 'src/api/hooks/admin.hook';

const hooks: FastifyPluginAsync = async function (fastify) {
  fastify.addHook('preHandler', adminOnlyHook);
};

export default hooks;
