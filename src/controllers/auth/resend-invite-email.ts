import { HttpError } from 'src/api/errors/HttpError';
import { IUsersRepo } from 'src/types/entities/IUsersRepo';
import { IMailService } from 'src/types/IMailService';
import { ISignatureService } from 'src/types/ISignatureService';

export async function resendInviteEmail(options: {
  baseUrl: string;
  emailTemplateId: string;
  fromEmail: string;
  mailService: IMailService;
  signatureService: ISignatureService;
  tokenTTLInMillis: number;
  userProfilesRepo: IUsersRepo;
  userId: string;
}): Promise<void> {
  const {
    baseUrl,
    emailTemplateId,
    fromEmail,
    mailService,
    signatureService,
    tokenTTLInMillis,
    userProfilesRepo,
    userId
  } = options;

  const existingUser = await userProfilesRepo.getUserById(userId);

  if (!existingUser) {
    throw new HttpError(404, 'User not found');
  }

  if (!existingUser.isPending) {
    throw new HttpError(400, 'User is already active');
  }

  const toEmail = existingUser.email;

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
