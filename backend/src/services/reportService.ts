import { prisma } from '../database/prisma';
import { createReport } from '../reports/reportGenerator';
import { ReportType } from '@prisma/client';

export class ReportService {
  static async getReports() {
    return prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async generateReport(
    title: string,
    type: ReportType,
    format: 'PDF' | 'CSV',
    startDate: string,
    endDate: string,
    userId?: string
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return createReport(title, type, format, start, end, userId);
  }
}
