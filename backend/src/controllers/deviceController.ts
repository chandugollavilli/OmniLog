import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { DeviceService } from '../services/deviceService';

export class DeviceController {
  static async getDevices(req: AuthenticatedRequest, res: Response) {
    try {
      const devices = await DeviceService.getDevices();
      return res.json(devices);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async createDevice(req: AuthenticatedRequest, res: Response) {
    try {
      const device = await DeviceService.createDevice(req.body);
      return res.status(201).json(device);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async updateDevice(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const device = await DeviceService.updateDevice(id, req.body);
      return res.json(device);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async deleteDevice(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      await DeviceService.deleteDevice(id);
      return res.json({ message: 'Device removed successfully.' });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
