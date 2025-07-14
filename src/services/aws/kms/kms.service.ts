import {
  GenerateMacCommand,
  VerifyMacCommand,
  MacAlgorithmSpec,
  KMSClient
} from '@aws-sdk/client-kms';

import { HttpError } from 'src/api/errors/HttpError';
import { ISignatureService } from 'src/types/services/ISignatureService';

const ENCODING: BufferEncoding = 'base64url';
const ALGORITHM: MacAlgorithmSpec = 'HMAC_SHA_512';

export function getAWSKmsService(options: { kmsKeyId: string }): ISignatureService {
  const { kmsKeyId } = options;

  const kms = new KMSClient();

  return {
    async sign(options) {
      const message = `${options.email}:${options.expiresAt}`;
      const messageBuffer = Buffer.from(message);

      const res = await kms.send(
        new GenerateMacCommand({
          KeyId: kmsKeyId,
          Message: messageBuffer,
          MacAlgorithm: ALGORITHM
        })
      );

      if (!res.Mac) {
        throw new HttpError(400, 'Failed to sign MAC');
      }

      return Buffer.from(res.Mac).toString(ENCODING);
    },

    async verify(options) {
      console.log('options', options);
      try {
        const message = `${options.email}:${options.expiresAt}`;
        const messageBuffer = Buffer.from(message);

        const res = await kms.send(
          new VerifyMacCommand({
            KeyId: kmsKeyId,
            Message: messageBuffer,
            Mac: Buffer.from(options.signature, ENCODING),
            MacAlgorithm: ALGORITHM
          })
        );

        return Boolean(res.MacValid);
      } catch {
        return false;
      }
    }
  };
}
