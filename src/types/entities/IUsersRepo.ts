import { TSignupReqSchema } from 'src/api/schemas/auth/SignupReqSchema';
import { TSignupRespSchema } from 'src/api/schemas/auth/SignupRespSchema';
import { TUserSchema } from '../UserSchema';

export interface IUsersRepo {
  createUser(payload: Omit<TSignupReqSchema, 'password'>, sub: string): Promise<TSignupRespSchema>;
  getUserById(id: string): Promise<TUserSchema | null>;
  getUserBySubId(id: string): Promise<TUserSchema | null>;
}
