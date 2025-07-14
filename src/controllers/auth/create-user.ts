import { TSignupReqSchema } from 'src/api/schemas/auth/SignupReqSchema';
import { IUsersRepo } from 'src/types/repos/IUsersRepo';
import { IIdentityService } from 'src/types/services/IIdentityService';

export async function createUser(params: {
  usersRepo: IUsersRepo;
  payload: TSignupReqSchema;
  identityService: IIdentityService;
}) {
  const { payload, usersRepo, identityService } = params;

  const sub = await identityService.createUser(payload);

  return usersRepo.createUser(
    {
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      isPending: false
    },
    sub
  );
}
