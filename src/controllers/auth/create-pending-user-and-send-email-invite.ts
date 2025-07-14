import { IUsersRepo } from 'src/types/repos/IUsersRepo';
import { IIdentityService } from 'src/types/services/IIdentityService';
import { IMailService } from 'src/types/services/IMailService';
import { ISignatureService } from 'src/types/services/ISignatureService';
import { sendInvite } from '../common/send-invite';

export async function createPendingUserAndSendEmailInvite(options: {
  baseUrl: string;
  emailTemplateId: string;
  fromEmail: string;
  mailService: IMailService;
  signatureService: ISignatureService;
  identityService: IIdentityService;
  toEmail: string;
  tokenTTLInMillis: number;
  userProfilesRepo: IUsersRepo;
}): Promise<void> {
  const {
    baseUrl,
    emailTemplateId,
    fromEmail,
    mailService,
    signatureService,
    identityService,
    toEmail,
    tokenTTLInMillis,
    userProfilesRepo
  } = options;

  const subId = await identityService.createUserWithoutPassword({ email: toEmail });

  await userProfilesRepo.createUser(
    {
      email: toEmail,
      firstName: '',
      lastName: '',
      isPending: true
    },
    subId
  );

  await sendInvite({
    baseUrl,
    emailTemplateId,
    fromEmail,
    mailService,
    signatureService,
    toEmail,
    tokenTTLInMillis
  });
}
