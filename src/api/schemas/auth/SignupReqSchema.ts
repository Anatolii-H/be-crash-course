import { z } from 'zod';
import { UserSchema } from '../users/GetUserByIdRespSchema';

export const SignupReqSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string()
});

export const SignupReqSchemaWithIsPending = SignupReqSchema.extend({
  isPending: UserSchema.shape.isPending
});

export type TSignupReqSchema = z.infer<typeof SignupReqSchema>;
export type TSignupReqSchemaWithIsPending = z.infer<typeof SignupReqSchemaWithIsPending>;
