import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { ExtendedError, Socket } from 'socket.io';

const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;

// WEBSOCKET: В тебе є метод для отримання юзера по токену, тобі не треба підключати aws-jwt-verify
// identityService.getUserByAccessToken(bearerToken);
const cognitoJwtVerifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USER_POOL_ID,
  tokenUse: 'access',
  clientId: COGNITO_CLIENT_ID
});

export const authMiddleware = async (socket: Socket, next: (err?: ExtendedError) => void) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers?.authorization as string | undefined)?.replace(/^Bearer\s+/i, '');

    if (!token) {
      return next(new Error('Unauthorized: Token is not provided'));
    }

    const payload = await cognitoJwtVerifier.verify(token);

    socket.data.user = {
      sub: payload.sub
    };

    next();
  } catch (error) {
    console.error('JWT verify error', error);

    next(new Error('Unauthorized: Invalid or expired token'));
  }
};
