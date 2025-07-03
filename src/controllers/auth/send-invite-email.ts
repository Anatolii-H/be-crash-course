import { IUsersRepo } from 'src/types/entities/IUsersRepo';
import { IIdentityService } from 'src/types/IIdentityService';
import { IMailService } from 'src/types/IMailService';
import { ISignatureService } from 'src/types/ISignatureService';

export async function sendInviteEmail(options: {
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

  const expireInMillis = Date.now() + tokenTTLInMillis;
  const token = signatureService.sign({ email: toEmail, expiresAt: String(expireInMillis) });
  const url = `${baseUrl}?email=${toEmail}&expireAt=${expireInMillis}&signature=${token}`;

  await mailService.send({
    from: fromEmail,
    to: toEmail,
    templateId: emailTemplateId,
    vars: { url }
  });
}
