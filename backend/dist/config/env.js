"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../.env') });
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.coerce.number().default(5000),
    API_PREFIX: zod_1.z.string().default('/api/v1'),
    FRONTEND_URL: zod_1.z.string().default('http://localhost:3000'),
    DATABASE_URL: zod_1.z.string().default('postgresql://omnilog:omnilog_secure_pass@localhost:5432/omnilog_db?schema=public'),
    JWT_SECRET: zod_1.z.string().min(16).default('omnilog_super_secret_jwt_key_32_chars_min!'),
    JWT_EXPIRES_IN: zod_1.z.string().default('15m'),
    REFRESH_TOKEN_SECRET: zod_1.z.string().min(16).default('omnilog_super_secret_refresh_token_key!'),
    REFRESH_TOKEN_EXPIRES_IN: zod_1.z.string().default('7d'),
    MAX_LOGIN_ATTEMPTS: zod_1.z.coerce.number().default(5),
    LOCK_TIME_MINUTES: zod_1.z.coerce.number().default(15),
    SYSLOG_UDP_PORT: zod_1.z.coerce.number().default(5140),
    SYSLOG_TCP_PORT: zod_1.z.coerce.number().default(5140),
    SYSLOG_TLS_PORT: zod_1.z.coerce.number().default(6514),
    SYSLOG_MAX_QUEUE_SIZE: zod_1.z.coerce.number().default(50000),
    SYSLOG_BATCH_FLUSH_MS: zod_1.z.coerce.number().default(500),
    SMTP_HOST: zod_1.z.string().optional().default(''),
    SMTP_PORT: zod_1.z.coerce.number().default(587),
    SMTP_USER: zod_1.z.string().optional().default(''),
    SMTP_PASS: zod_1.z.string().optional().default(''),
    ALERT_EMAIL_FROM: zod_1.z.string().default('alerts@omnilog.local'),
});
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
    console.error('❌ Invalid Environment Variables Configuration:', parsedEnv.error.format());
    process.exit(1);
}
exports.env = parsedEnv.data;
