import { Router } from 'express';
import { ReportController } from '../controllers/reportController';
import { authenticateJWT, requireRole } from '../middleware/authMiddleware';
import { RoleName } from '@prisma/client';

const router = Router();

router.use(authenticateJWT);

router.get('/', ReportController.getReports);
router.post('/generate', requireRole([RoleName.ADMINISTRATOR, RoleName.SOC_ANALYST, RoleName.AUDITOR]), ReportController.generateReport);

export default router;
