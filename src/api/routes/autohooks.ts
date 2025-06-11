import { FastifyPluginAsync } from 'fastify';
import { testHook } from '../hooks/test.hook';
import { authHook } from '../hooks/auth.hook';

const hooks: FastifyPluginAsync = async function (fastify) {
  fastify.addHook('preHandler', testHook);
  fastify.addHook('preHandler', authHook);
};

export default hooks;
