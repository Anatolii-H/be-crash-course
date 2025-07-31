import { TSignupReqSchemaWithIsPending } from 'src/api/schemas/auth/SignupReqSchema';
import {
  TGetUsersReqQueries,
  TUserSchema,
  TUserSchemaExtendedMetadata
} from 'src/api/schemas/users/GetUserByIdRespSchema';
import { TTransaction } from '../ITransaction';

export interface IUsersRepo {
  createUser(
    payload: Omit<TSignupReqSchemaWithIsPending, 'password'>,
    sub: string,
    tx?: TTransaction
  ): Promise<TUserSchema>;
  getUserByEmail(email: string): Promise<TUserSchema | null>;
  getUserById(options: {
    userId: string;
    tx?: TTransaction;
    skipDeleted?: boolean;
  }): Promise<TUserSchema | null>;
  getUserBySubId(id: string): Promise<TUserSchema | null>;
  getUsers(queries: TGetUsersReqQueries): Promise<TUserSchemaExtendedMetadata>;
  updateUser(
    userId: string,
    payload: Partial<TUserSchema>,
    tx?: TTransaction
  ): Promise<TUserSchema | null>;
  softDeleteUser(userId: string, tx?: TTransaction): Promise<boolean>;
  deleteUser(userId: string, tx?: TTransaction): Promise<boolean>;
  restoreSoftDeletedUser(userId: string, tx?: TTransaction): Promise<boolean>;
  getSoftDeletedUsers(userId: string, tx?: TTransaction): Promise<TUserSchema[]>;
  getExistingUserIds(userIds: string[], tx?: TTransaction): Promise<{ id: string }[]>;
}
