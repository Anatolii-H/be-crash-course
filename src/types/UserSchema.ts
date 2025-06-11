import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  sub: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type TUserSchema = z.infer<typeof UserSchema>;
