import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { AlertService } from '../services/alertService';

export class AlertController {
  static async getAlerts(req: AuthenticatedRequest, res: Response) {
    try {
      const { status, severity } = req.query;
      const alerts = await AlertService.getAlerts(status as any, severity as any);
      return res.json(alerts);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async updateAlertStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await AlertService.updateAlertStatus(id, status);
      return res.json(updated);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async getAlertRules(req: AuthenticatedRequest, res: Response) {
    try {
      const rules = await AlertService.getAlertRules();
      return res.json(rules);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async createAlertRule(req: AuthenticatedRequest, res: Response) {
    try {
      const rule = await AlertService.createAlertRule(req.body);
      return res.status(201).json(rule);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async deleteAlertRule(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      await AlertService.deleteAlertRule(id);
      return res.json({ message: 'Alert rule removed.' });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
