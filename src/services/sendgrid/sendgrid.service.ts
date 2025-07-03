import sgMail from '@sendgrid/mail';

import { IMailService } from 'src/types/IMailService';

export function getMailService(options: { apiKey: string }): IMailService {
  const { apiKey } = options;

  sgMail.setApiKey(apiKey);

  return {
    send: async (options) => {
      const { to, from, templateId, vars } = options;

      await sgMail.send({
        to,
        from,
        templateId,
        dynamicTemplateData: vars
      });
    }
  };
}
