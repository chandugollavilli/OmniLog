import { Router } from 'express';
import { AuditController } from '../controllers/auditController';
import { authenticateJWT, requireRole } from '../middleware/authMiddleware';
import { RoleName } from '@prisma/client';

const router = Router();

router.use(authenticateJWT);

router.get('/', requireRole([RoleName.ADMINISTRATOR, RoleName.AUDITOR]), AuditController.getAuditLogs);

export default router;
