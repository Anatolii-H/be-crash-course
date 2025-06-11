import { preHandlerAsyncHookHandler } from 'fastify';

import { HttpError } from '../errors/HttpError';

const TOKEN_HEADER_NAME = 'Authorization';

export const authHook: preHandlerAsyncHookHandler = async function (request) {
  if (request.routeOptions.config?.skipAuth) {
    return;
  }

  try {
    const token = (request.headers[TOKEN_HEADER_NAME] ||
      request.headers[TOKEN_HEADER_NAME.toLowerCase()]) as string;

    if (!token) {
      throw new Error('No token');
    }

    const bearerTokenMatch = token.match(/Bearer\s+([A-Za-z0-9-._~+/]+=*)$/);

    if (!bearerTokenMatch) {
      throw new Error('Token in wrong format');
    }

    const [, bearerToken] = bearerTokenMatch;

    const identityUser = await this.identityService.getUserByAccessToken(bearerToken);

    request.identityUser = identityUser;

    const { usersRepo } = this.repos;

    const foundUserBySubId = await usersRepo.getUserBySubId(identityUser.subId);

    if (!foundUserBySubId) {
      throw new HttpError(404, 'User is not found by sub id');
    }

    request.profile = foundUserBySubId;

    request.log = request.log.child({
      userSubId: identityUser.subId,
      userEmail: identityUser.email,
      userProfileId: request.profile.id
    });
  } catch (err) {
    console.log('err555', err);
    throw new HttpError(401, 'Unathorized');
  }
};
