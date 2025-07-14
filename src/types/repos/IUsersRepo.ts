import { TSignupReqSchemaWithIsPending } from 'src/api/schemas/auth/SignupReqSchema';
import {
  TGetUsersReqQueries,
  TUserSchema,
  TUserSchemaExtendedMetadata
} from 'src/api/schemas/users/GetUserByIdRespSchema';

export interface IUsersRepo {
  createUser(
    payload: Omit<TSignupReqSchemaWithIsPending, 'password'>,
    sub: string
  ): Promise<TUserSchema>;
  getUserByEmail(email: string): Promise<TUserSchema | null>;
  getUserById(id: string): Promise<TUserSchema | null>;
  getUserBySubId(id: string): Promise<TUserSchema | null>;
  getUsers(queries: TGetUsersReqQueries): Promise<TUserSchemaExtendedMetadata>;
  updateUser(userId: string, payload: Partial<TUserSchema>): Promise<TUserSchema | null>;
}
