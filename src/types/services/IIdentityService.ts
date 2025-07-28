import { TSignupReqSchema } from 'src/api/schemas/auth/SignupReqSchema';
import { IdentityUser } from '../IdentityUser';

export interface IIdentityService {
  setUserPassword(payload: Pick<TSignupReqSchema, 'email' | 'password'>): Promise<void>;
  createUser(payload: TSignupReqSchema): Promise<string>;
  createUserWithoutPassword(payload: Pick<TSignupReqSchema, 'email'>): Promise<string>;
  getUserByAccessToken(token: string): Promise<IdentityUser>;
  getUserBySubId(subId: string): Promise<IdentityUser>;
  disableUser(email: string): Promise<void>;
  enableUser(email: string): Promise<void>;
  deleteUser(email: string): Promise<void>;
}
