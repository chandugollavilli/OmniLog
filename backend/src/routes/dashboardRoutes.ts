import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/metrics', DashboardController.getDashboardMetrics);

export default router;
