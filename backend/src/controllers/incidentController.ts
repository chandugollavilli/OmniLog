import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { IncidentService } from '../services/incidentService';

export class IncidentController {
  static async getIncidents(req: AuthenticatedRequest, res: Response) {
    try {
      const { status } = req.query;
      const incidents = await IncidentService.getIncidents(status as any);
      return res.json(incidents);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async createIncident(req: AuthenticatedRequest, res: Response) {
    try {
      const incident = await IncidentService.createIncident(req.body);
      return res.status(201).json(incident);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async updateStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await IncidentService.updateIncidentStatus(id, status);
      return res.json(updated);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
