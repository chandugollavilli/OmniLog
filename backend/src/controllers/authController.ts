import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await AuthService.login(email, password, ipAddress, userAgent);
      return res.json(result);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required.' });
      }

      const result = await AuthService.refresh(refreshToken);
      return res.json(result);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }
      return res.json({ message: 'Logged out successfully.' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
