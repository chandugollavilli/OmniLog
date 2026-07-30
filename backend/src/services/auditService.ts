import { prisma } from '../database/prisma';

export class AuditService {
  static async getAuditLogs(page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [total, logs] = await Promise.all([
      prisma.auditLog.count(),
      prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, email: true, username: true },
          },
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      logs,
    };
  }

  static async logAction(userId: string | null, action: string, ipAddress?: string, details?: string) {
    return prisma.auditLog.create({
      data: {
        userId,
        action,
        ipAddress,
        details,
      },
    });
  }
}
