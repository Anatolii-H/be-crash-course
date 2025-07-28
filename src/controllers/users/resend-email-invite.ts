import { HttpError } from 'src/api/errors/HttpError';
import { IUsersRepo } from 'src/types/repos/IUsersRepo';
import { IMailService } from 'src/types/services/IMailService';
import { ISignatureService } from 'src/types/services/ISignatureService';
import { sendInvite } from '../common/send-invite';

export async function resendEmailInvite(options: {
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

  const existingUser = await userProfilesRepo.getUserById({ userId });

  if (!existingUser) {
    throw new HttpError(404, 'User not found');
  }

  if (!existingUser.isPending) {
    throw new HttpError(400, 'User is already active');
  }

  const toEmail = existingUser.email;

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
