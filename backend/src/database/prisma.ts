import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

export async function connectWithRetry(maxRetries = 10, initialDelayMs = 1000): Promise<void> {
  let retries = 0;
  let delay = initialDelayMs;

  while (retries < maxRetries) {
    try {
      await prisma.$connect();
      logger.info('Successfully connected to PostgreSQL database.');
      return;
    } catch (err: any) {
      retries++;
      logger.warn(`Database connection attempt ${retries}/${maxRetries} failed: ${err.message}. Retrying in ${delay}ms...`);
      if (retries >= maxRetries) {
        logger.error('Max database connection retries reached. Could not connect to PostgreSQL.', err);
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * 1.5, 10000);
    }
  }
}
