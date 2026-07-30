import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { LogService } from '../services/logService';

export class LogController {
  static async getLogs(req: AuthenticatedRequest, res: Response) {
    try {
      const {
        page,
        limit,
        ip,
        user,
        country,
        app,
        policyid,
        proto,
        level,
        action,
        devname,
        service,
        startDate,
        endDate,
        search,
      } = req.query;

      const result = await LogService.getLogs({
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 50,
        ip: ip as string,
        user: user as string,
        country: country as string,
        app: app as string,
        policyid: policyid ? parseInt(policyid as string, 10) : undefined,
        proto: proto ? parseInt(proto as string, 10) : undefined,
        level: level as string,
        action: action as string,
        devname: devname as string,
        service: service as string,
        startDate: startDate as string,
        endDate: endDate as string,
        search: search as string,
      });

      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getLogById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const log = await LogService.getLogById(id);
      if (!log) {
        return res.status(404).json({ error: 'Log entry not found.' });
      }
      return res.json(log);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
