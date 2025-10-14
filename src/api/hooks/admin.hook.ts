import { preHandlerAsyncHookHandler } from 'fastify';

import { HttpError } from '../errors/HttpError';

export const adminOnlyHook: preHandlerAsyncHookHandler = async function (request) {
  if (request.profile?.role !== 'admin') {
    // CODE REVIEW: Встанови собі екстеншин для перевірки правопису. В мене стоїть spell-checker. 
    throw new HttpError(403, 'Permisson denied');
  }
};
