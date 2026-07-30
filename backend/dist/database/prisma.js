"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
exports.prisma = new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});
exports.prisma.$connect()
    .then(() => logger_1.logger.info('Successfully connected to PostgreSQL database.'))
    .catch((err) => logger_1.logger.error('Database connection error:', err));
