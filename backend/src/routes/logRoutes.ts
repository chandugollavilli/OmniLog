import { Router } from 'express';
import { LogController } from '../controllers/logController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', LogController.getLogs);
router.get('/:id', LogController.getLogById);

export default router;
