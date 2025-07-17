import { z } from 'zod';

export const UpdateTagReqSchema = z.object({
  name: z.string()
});

export type TUpdateTagReqSchema = z.infer<typeof UpdateTagReqSchema>;
