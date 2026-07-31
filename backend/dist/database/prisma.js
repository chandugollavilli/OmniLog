"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.connectWithRetry = connectWithRetry;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
exports.prisma = new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});
async function connectWithRetry(maxRetries = 10, initialDelayMs = 1000) {
    let retries = 0;
    let delay = initialDelayMs;
    while (retries < maxRetries) {
        try {
            await exports.prisma.$connect();
            logger_1.logger.info('Successfully connected to PostgreSQL database.');
            return;
        }
        catch (err) {
            retries++;
            logger_1.logger.warn(`Database connection attempt ${retries}/${maxRetries} failed: ${err.message}. Retrying in ${delay}ms...`);
            if (retries >= maxRetries) {
                logger_1.logger.error('Max database connection retries reached. Could not connect to PostgreSQL.', err);
                throw err;
            }
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay = Math.min(delay * 1.5, 10000);
        }
    }
}
