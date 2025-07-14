import { HttpError } from 'src/api/errors/HttpError';
import { IUsersRepo } from 'src/types/repos/IUsersRepo';
import { IIdentityService } from 'src/types/services/IIdentityService';

export async function enableUser(params: {
  userId: string;
  usersRepo: IUsersRepo;
  identityService: IIdentityService;
}) {
  const { usersRepo, userId, identityService } = params;

  const user = await params.usersRepo.getUserById(userId);

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  await identityService.enableUser(user.email);
  await usersRepo.updateUser(userId, { isDisabled: false });

  return true;
}
