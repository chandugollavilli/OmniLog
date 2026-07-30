"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const prisma_1 = require("../database/prisma");
class AuditService {
    static async getAuditLogs(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [total, logs] = await Promise.all([
            prisma_1.prisma.auditLog.count(),
            prisma_1.prisma.auditLog.findMany({
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
    static async logAction(userId, action, ipAddress, details) {
        return prisma_1.prisma.auditLog.create({
            data: {
                userId,
                action,
                ipAddress,
                details,
            },
        });
    }
}
exports.AuditService = AuditService;
