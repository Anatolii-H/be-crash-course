import { HttpError } from 'src/api/errors/HttpError';
import { IUsersRepo } from 'src/types/entities/IUsersRepo';

export async function getUserBySub(params: { usersRepo: IUsersRepo; subId: string }) {
  const { usersRepo, subId } = params;

  const foundUser = usersRepo.getUserBySubId(subId);

  if (!foundUser) {
    throw new HttpError(404, 'User not found');
  }

  return foundUser;
}
