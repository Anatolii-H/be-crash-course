import { HttpError } from 'src/api/errors/HttpError';
import { IUsersRepo } from 'src/types/entities/IUsersRepo';

export async function getUserById(params: { usersRepo: IUsersRepo; userId: string }) {
  const { usersRepo, userId } = params;

  const foundUser = await usersRepo.getUserById(userId);

  if (!foundUser) {
    throw new HttpError(404, 'User not found');
  }

  return foundUser;
}
