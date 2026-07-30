import { Router } from 'express';
import { AlertController } from '../controllers/alertController';
import { authenticateJWT, requireRole } from '../middleware/authMiddleware';
import { RoleName } from '@prisma/client';

const router = Router();

router.use(authenticateJWT);

router.get('/', AlertController.getAlerts);
router.patch('/:id/status', AlertController.updateAlertStatus);

router.get('/rules', AlertController.getAlertRules);
router.post('/rules', requireRole([RoleName.ADMINISTRATOR, RoleName.SOC_ANALYST]), AlertController.createAlertRule);
router.delete('/rules/:id', requireRole([RoleName.ADMINISTRATOR]), AlertController.deleteAlertRule);

export default router;
