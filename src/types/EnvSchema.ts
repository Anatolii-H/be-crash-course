import { z } from 'zod';

// DONT USE transform here
// because we are not overwriting process.env
export const EnvSchema = z.object({
  TZ: z.string().optional(),
  NODE_ENV: z.enum(['local', 'staging', 'production']),

  PORT: z.string(),
  HOST: z.string(),

  PGHOST: z.string(),
  PGPORT: z.string(),
  PGUSERNAME: z.string(),
  PGPASSWORD: z.string(),
  PGDATABASE: z.string(),

  SWAGGER_USER: z.string(),
  SWAGGER_PWD: z.string().min(10),

  COGNITO_USER_POOL_ID: z.string(),
  KMS_KEY_ID: z.string(),

  RESET_PASSWORD_TOKEN_TTL_MS: z.coerce.number(),
  RESET_PASSWORD_TEMPLATE_ID: z.string(),
  FROM_EMAIL: z.string(),
  SENDGRID_API_KEY: z.string(),

  FRONTEND_BASE_URL: z.string(),
  FRONTEND_RESET_PASSWORD_URL: z.string()
});

export type Env = z.infer<typeof EnvSchema>;
