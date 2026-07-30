import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { AuditService } from '../services/auditService';

export class AuditController {
  static async getAuditLogs(req: AuthenticatedRequest, res: Response) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

      const result = await AuditService.getAuditLogs(page, limit);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
