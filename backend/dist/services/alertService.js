"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertService = void 0;
const prisma_1 = require("../database/prisma");
class AlertService {
    static async getAlerts(status, severity) {
        const where = {};
        if (status)
            where.status = status;
        if (severity)
            where.severity = severity;
        return prisma_1.prisma.alert.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
    static async updateAlertStatus(id, status) {
        return prisma_1.prisma.alert.update({
            where: { id },
            data: { status, updatedAt: new Date() },
        });
    }
    static async getAlertRules() {
        return prisma_1.prisma.alertRule.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    static async createAlertRule(data) {
        return prisma_1.prisma.alertRule.create({
            data: {
                ...data,
                threshold: data.threshold || 1,
                windowMins: data.windowMins || 5,
            },
        });
    }
    static async deleteAlertRule(id) {
        return prisma_1.prisma.alertRule.delete({ where: { id } });
    }
}
exports.AlertService = AlertService;
