import { z } from 'zod';

export const SignupRespSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  sub: z.string()
});

export type TSignupRespSchema = z.infer<typeof SignupRespSchema>;
