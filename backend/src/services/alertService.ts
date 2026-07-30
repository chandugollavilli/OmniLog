import { prisma } from '../database/prisma';
import { AlertSeverity, AlertStatus } from '@prisma/client';

export class AlertService {
  static async getAlerts(status?: AlertStatus, severity?: AlertSeverity) {
    const where: any = {};
    if (status) where.status = status;
    if (severity) where.severity = severity;

    return prisma.alert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  static async updateAlertStatus(id: string, status: AlertStatus) {
    return prisma.alert.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });
  }

  static async getAlertRules() {
    return prisma.alertRule.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createAlertRule(data: {
    name: string;
    description?: string;
    eventType: string;
    severity: AlertSeverity;
    condition: string;
    threshold?: number;
    windowMins?: number;
    isEmail?: boolean;
    isWebhook?: boolean;
    webhookUrl?: string;
  }) {
    return prisma.alertRule.create({
      data: {
        ...data,
        threshold: data.threshold || 1,
        windowMins: data.windowMins || 5,
      },
    });
  }

  static async deleteAlertRule(id: string) {
    return prisma.alertRule.delete({ where: { id } });
  }
}
