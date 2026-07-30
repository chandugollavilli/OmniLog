import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { DashboardService } from '../services/dashboardService';

export class DashboardController {
  static async getDashboardMetrics(req: AuthenticatedRequest, res: Response) {
    try {
      const metrics = await DashboardService.getDashboardMetrics();
      return res.json(metrics);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
