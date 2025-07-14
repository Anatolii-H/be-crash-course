import { IRepos } from 'src/repos';
import { IUUIDService } from 'src/services/uuid';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IIdentityService } from 'src/types/services/IIdentityService';
import { IMailService } from 'src/types/services/IMailService';
import { IdentityUser } from 'src/types/IdentityUser';
import { TUserSchema } from 'src/api/schemas/users/GetUserByIdRespSchema';
import { IStorageService } from './services/IStorageService';
import { ISignatureService } from './services/ISignatureService';

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
