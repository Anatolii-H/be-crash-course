import { TSignupReqSchema } from 'src/api/schemas/auth/SignupReqSchema';
import { TSignupRespSchema } from 'src/api/schemas/auth/SignupRespSchema';
import {
  TGetUsersReqQueries,
  TUserSchema,
  TUserSchemaExtendedMetadata
} from 'src/api/schemas/users/GetUserByIdRespSchema';

export interface IUsersRepo {
  createUser(payload: Omit<TSignupReqSchema, 'password'>, sub: string): Promise<TSignupRespSchema>;
  getUserById(id: string): Promise<TUserSchema | null>;
  getUserBySubId(id: string): Promise<TUserSchema | null>;
  getUsers(queries: TGetUsersReqQueries): Promise<TUserSchemaExtendedMetadata>;
  updateUser(userId: string, payload: Partial<TUserSchema>): Promise<TUserSchema | null>;
}
