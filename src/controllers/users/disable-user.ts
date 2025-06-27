import { HttpError } from 'src/api/errors/HttpError';
import { IUsersRepo } from 'src/types/entities/IUsersRepo';
import { IIdentityService } from 'src/types/IIdentityService';

export async function disableUser(params: {
  userId: string;
  requestUserId: string;
  usersRepo: IUsersRepo;
  identityService: IIdentityService;
}) {
  const { usersRepo, userId, requestUserId, identityService } = params;

  if (userId === requestUserId) {
    throw new HttpError(400, 'You cannot disable yourself');
  }

  const user = await params.usersRepo.getUserById(userId);

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  await identityService.disableUser(user.email);
  await usersRepo.updateUser(userId, { isDisabled: true });

  return true;
}
