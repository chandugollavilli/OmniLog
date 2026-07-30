import { Router } from 'express';
import { AIController } from '../controllers/aiController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.post('/query', AIController.queryAssistant);

export default router;
