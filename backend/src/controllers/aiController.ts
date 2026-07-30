import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { AIService } from '../services/aiService';

export class AIController {
  static async queryAssistant(req: AuthenticatedRequest, res: Response) {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt query is required.' });
      }

      const result = await AIService.querySecurityAssistant(prompt);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
