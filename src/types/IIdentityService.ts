import { TSignupReqSchema } from 'src/api/schemas/auth/SignupReqSchema';
import { IdentityUser } from './IdentityUser';

export interface IIdentityService {
  createUser(payload: TSignupReqSchema): Promise<string>;
  getUserByAccessToken(token: string): Promise<IdentityUser>;
  getUserBySubId(subId: string): Promise<IdentityUser>;
  disableUser(email: string): Promise<void>;
  enableUser(email: string): Promise<void>;
}
