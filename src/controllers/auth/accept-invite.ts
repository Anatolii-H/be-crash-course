import { HttpError } from 'src/api/errors/HttpError';

import { TAcceptInviteReqSchema } from 'src/api/schemas/auth/AcceptInviteReqSchema';
import { IUsersRepo } from 'src/types/repos/IUsersRepo';
import { IIdentityService } from 'src/types/services/IIdentityService';
import { ISignatureService } from 'src/types/services/ISignatureService';

export async function acceptInvite(options: {
  userProfilesRepo: IUsersRepo;
  identityService: IIdentityService;
  signatureService: ISignatureService;
  data: TAcceptInviteReqSchema;
}) {
  const { data, identityService, signatureService, userProfilesRepo } = options;

  const userProfile = await userProfilesRepo.getUserByEmail(data.email);

  if (!userProfile) {
    throw new HttpError(404, 'User not found');
  }

  if (!userProfile.isPending) {
    throw new HttpError(400, 'User is already active');
  }

  if (data.expireAt < Date.now()) {
    throw new HttpError(400, 'Invite is expired');
  }

  const isSignatureValid = await signatureService.verify({
    email: data.email,
    expiresAt: String(data.expireAt),
    signature: data.signature
  });

  if (!isSignatureValid) {
    throw new HttpError(400, 'Invalid signature');
  }

  await identityService.setUserPassword({ email: data.email, password: data.password });

  await userProfilesRepo.updateUser(userProfile.id, {
    isPending: false,
    firstName: data.firstName,
    lastName: data.lastName
  });
}
