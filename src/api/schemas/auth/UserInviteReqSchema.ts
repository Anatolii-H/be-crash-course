import { z } from 'zod';

export const UserInviteReqSchema = z.object({
  email: z.string().email()
});

export type TUserInviteReqSchema = z.infer<typeof UserInviteReqSchema>;
