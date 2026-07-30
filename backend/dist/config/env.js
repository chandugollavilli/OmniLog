"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../.env') });
exports.env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000', 10),
    API_PREFIX: process.env.API_PREFIX || '/api/v1',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://omnilog:omnilog_secure_pass@localhost:5432/omnilog_db?schema=public',
    JWT_SECRET: process.env.JWT_SECRET || 'omnilog_super_secret_jwt_key_32_chars_min!',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'omnilog_super_secret_refresh_token_key!',
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    MAX_LOGIN_ATTEMPTS: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
    LOCK_TIME_MINUTES: parseInt(process.env.LOCK_TIME_MINUTES || '15', 10),
    SYSLOG_UDP_PORT: parseInt(process.env.SYSLOG_UDP_PORT || '5140', 10),
    SYSLOG_TCP_PORT: parseInt(process.env.SYSLOG_TCP_PORT || '5140', 10),
    SYSLOG_TLS_PORT: parseInt(process.env.SYSLOG_TLS_PORT || '6514', 10),
    SYSLOG_MAX_QUEUE_SIZE: parseInt(process.env.SYSLOG_MAX_QUEUE_SIZE || '50000', 10),
    SYSLOG_BATCH_FLUSH_MS: parseInt(process.env.SYSLOG_BATCH_FLUSH_MS || '500', 10),
    SMTP_HOST: process.env.SMTP_HOST || '',
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
    ALERT_EMAIL_FROM: process.env.ALERT_EMAIL_FROM || 'alerts@omnilog.local',
};
