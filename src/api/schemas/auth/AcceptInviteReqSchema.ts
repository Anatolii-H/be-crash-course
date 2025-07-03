import { z } from 'zod';

import { SignupReqSchema } from './SignupReqSchema';

export const AcceptInviteReqSchema = SignupReqSchema.extend({
  expireAt: z.coerce.number(),
  signature: z.string()
});

export type TAcceptInviteReqSchema = z.infer<typeof AcceptInviteReqSchema>;
