import { Request, Response } from 'express';
import { prisma } from '../database/prisma';
import { logQueue } from '../collectors/logQueue';

export class HealthController {
  static async checkHealth(req: Request, res: Response) {
    let dbStatus = 'HEALTHY';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'UNHEALTHY';
    }

    const memoryUsage = process.memoryUsage();
    const queueStats = logQueue.getStats();

    return res.json({
      status: dbStatus === 'HEALTHY' ? 'OK' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
      queue: queueStats,
      memory: {
        rssMB: Math.round(memoryUsage.rss / (1024 * 1024)),
        heapTotalMB: Math.round(memoryUsage.heapTotal / (1024 * 1024)),
        heapUsedMB: Math.round(memoryUsage.heapUsed / (1024 * 1024)),
      },
    });
  }
}
