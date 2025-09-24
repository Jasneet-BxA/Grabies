import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

export const env = createEnv({
  server: {
    SUPABASE_URL: z.url(),
    JWT_SECRET: z.string().min(10),
    PORT: z.coerce.number().default(3000),
    JWT_EXPIRES_IN: z.string().default('1d'),
    SUPABASE_KEY: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().min(10), 
  },
  runtimeEnv: process.env,
});
