import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { UserService } from '../services/userService';

export class UserController {
  static async getUsers(req: AuthenticatedRequest, res: Response) {
    try {
      const users = await UserService.getUsers();
      return res.json(users);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async createUser(req: AuthenticatedRequest, res: Response) {
    try {
      const user = await UserService.createUser(req.body);
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async updateUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.updateUser(id, req.body);
      return res.json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async deleteUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id);
      return res.json({ message: 'User deleted successfully.' });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
