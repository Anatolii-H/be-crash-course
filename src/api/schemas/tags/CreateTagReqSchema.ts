import { z } from 'zod';

export const CreateTagReqSchema = z.object({
  name: z.string()
});

export type TCreateTagReqSchema = z.infer<typeof CreateTagReqSchema>;
