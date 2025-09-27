import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  SUPABASE_URL: z.url(),
  JWT_SECRET: z.string().min(10),
  PORT: z.coerce.number().default(3000),
  JWT_EXPIRES_IN: z.string().default("1d"),
  SUPABASE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().min(10),
});

export const env = envSchema.parse(process.env);
