import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { ReportService } from '../services/reportService';

export class ReportController {
  static async getReports(req: AuthenticatedRequest, res: Response) {
    try {
      const reports = await ReportService.getReports();
      return res.json(reports);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async generateReport(req: AuthenticatedRequest, res: Response) {
    try {
      const { title, type, format, startDate, endDate } = req.body;
      const userId = req.user?.userId;

      const report = await ReportService.generateReport(
        title || 'Security Log Audit Report',
        type || 'DAILY',
        format || 'PDF',
        startDate || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        endDate || new Date().toISOString(),
        userId
      );

      return res.status(201).json(report);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
