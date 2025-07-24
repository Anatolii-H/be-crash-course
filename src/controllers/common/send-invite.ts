import { IMailService } from 'src/types/services/IMailService';
import { ISignatureService } from 'src/types/services/ISignatureService';

export async function sendInvite(options: {
  baseUrl: string;
  emailTemplateId: string;
  fromEmail: string;
  mailService: IMailService;
  signatureService: ISignatureService;
  toEmail: string;
  tokenTTLInMillis: number;
}): Promise<void> {
  const {
    baseUrl,
    emailTemplateId,
    fromEmail,
    mailService,
    signatureService,
    toEmail,
    tokenTTLInMillis
  } = options;

  const expireInMillis = Date.now() + Number(tokenTTLInMillis);
  const token = await signatureService.sign({ email: toEmail, expiresAt: String(expireInMillis) });
  const url = `${baseUrl}?email=${toEmail}&expireAt=${expireInMillis}&signature=${token}`;

  await mailService.send({
    from: fromEmail,
    to: toEmail,
    templateId: emailTemplateId,
    vars: { url }
  });
}
