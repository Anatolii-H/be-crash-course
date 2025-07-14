import sgMail from '@sendgrid/mail';

import { IMailService } from 'src/types/services/IMailService';

export function getMailService(options: { apiKey: string }): IMailService {
  const { apiKey } = options;

  sgMail.setApiKey(apiKey);

  return {
    send: async (options) => {
      const { to, from, templateId, vars } = options;
      vars.firstName = 'Test';

      console.log('vars', vars);

      await sgMail.send({
        to,
        from,
        templateId,
        dynamicTemplateData: vars
      });
    }
  };
}
