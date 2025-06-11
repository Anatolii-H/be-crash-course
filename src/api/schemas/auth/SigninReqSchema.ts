import { z } from 'zod';

export const SigninReqSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export type TSigninReqSchema = z.infer<typeof SigninReqSchema>;
