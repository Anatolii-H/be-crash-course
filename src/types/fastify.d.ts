import { IRepos } from 'src/repos';
import { IUUIDService } from 'src/services/uuid';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IIdentityService } from 'src/types/IIdentityService';
import { IMailService } from 'src/types/IMailService';
import { IdentityUser } from 'src/types/IdentityUser';
import { TUserSchema } from 'src/api/schemas/users/GetUserByIdRespSchema';
import { IStorageService } from './IStorageService';
import { ISignatureService } from './ISignatureService';

// set context type
declare module 'fastify' {
  interface FastifyInstance {
    uuid: IUUIDService;
    db: NodePgDatabase;
    repos: IRepos;
    identityService: IIdentityService;
    signatureService: ISignatureService;
    mailService: IMailService;
    storageService: IStorageService;
  }

  interface FastifyRequest {
    profile?: TUserSchema;
    identityUser?: IdentityUser;
  }

  interface FastifyContextConfig {
    skipAuth?: boolean;
  }
}
