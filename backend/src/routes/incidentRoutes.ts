import { Router } from 'express';
import { IncidentController } from '../controllers/incidentController';
import { authenticateJWT, requireRole } from '../middleware/authMiddleware';
import { RoleName } from '@prisma/client';

const router = Router();

router.use(authenticateJWT);

router.get('/', IncidentController.getIncidents);
router.post('/', requireRole([RoleName.ADMINISTRATOR, RoleName.SOC_ANALYST]), IncidentController.createIncident);
router.patch('/:id/status', IncidentController.updateStatus);

export default router;
