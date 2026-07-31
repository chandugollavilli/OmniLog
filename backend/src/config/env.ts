import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  API_PREFIX: z.string().default('/api/v1'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string().default('postgresql://omnilog:omnilog_secure_pass@localhost:5432/omnilog_db?schema=public'),

  JWT_SECRET: z.string().min(16).default('omnilog_super_secret_jwt_key_32_chars_min!'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_SECRET: z.string().min(16).default('omnilog_super_secret_refresh_token_key!'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),

  MAX_LOGIN_ATTEMPTS: z.coerce.number().default(5),
  LOCK_TIME_MINUTES: z.coerce.number().default(15),

  SYSLOG_UDP_PORT: z.coerce.number().default(5140),
  SYSLOG_TCP_PORT: z.coerce.number().default(5140),
  SYSLOG_TLS_PORT: z.coerce.number().default(6514),
  SYSLOG_MAX_QUEUE_SIZE: z.coerce.number().default(50000),
  SYSLOG_BATCH_FLUSH_MS: z.coerce.number().default(500),

  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  ALERT_EMAIL_FROM: z.string().default('alerts@omnilog.local'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid Environment Variables Configuration:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
