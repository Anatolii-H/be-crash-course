import { preHandlerAsyncHookHandler } from 'fastify';

import { HttpError } from '../errors/HttpError';

export const adminOnlyHook: preHandlerAsyncHookHandler = async function (request) {
  if (request.profile?.role !== 'admin') {
    throw new HttpError(403, 'Permisson denied');
  }
};
