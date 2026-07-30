import { Router } from 'express';
import { DeviceController } from '../controllers/deviceController';
import { authenticateJWT, requireRole } from '../middleware/authMiddleware';
import { RoleName } from '@prisma/client';

const router = Router();

router.use(authenticateJWT);

router.get('/', DeviceController.getDevices);
router.post('/', requireRole([RoleName.ADMINISTRATOR, RoleName.SOC_ANALYST]), DeviceController.createDevice);
router.put('/:id', requireRole([RoleName.ADMINISTRATOR, RoleName.SOC_ANALYST]), DeviceController.updateDevice);
router.delete('/:id', requireRole([RoleName.ADMINISTRATOR]), DeviceController.deleteDevice);

export default router;
