import { TGetUsersReqQueries } from 'src/api/schemas/users/GetUserByIdRespSchema';
import { IUsersRepo } from 'src/types/entities/IUsersRepo';

export async function getUsers(params: { usersRepo: IUsersRepo; queries: TGetUsersReqQueries }) {
  const { usersRepo, queries } = params;

  return usersRepo.getUsers(queries);
}
