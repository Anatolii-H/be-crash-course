import { z } from 'zod';

export const SignupReqSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string()
});

export type TSignupReqSchema = z.infer<typeof SignupReqSchema>;
