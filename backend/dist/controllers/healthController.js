"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const prisma_1 = require("../database/prisma");
const logQueue_1 = require("../collectors/logQueue");
class HealthController {
    static async checkHealth(req, res) {
        let dbStatus = 'HEALTHY';
        try {
            await prisma_1.prisma.$queryRaw `SELECT 1`;
        }
        catch {
            dbStatus = 'UNHEALTHY';
        }
        const memoryUsage = process.memoryUsage();
        const queueStats = logQueue_1.logQueue.getStats();
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
exports.HealthController = HealthController;
