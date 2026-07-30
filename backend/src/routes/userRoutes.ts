import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateJWT, requireRole } from '../middleware/authMiddleware';
import { RoleName } from '@prisma/client';

const router = Router();

router.use(authenticateJWT);

router.get('/', requireRole([RoleName.ADMINISTRATOR, RoleName.AUDITOR]), UserController.getUsers);
router.post('/', requireRole([RoleName.ADMINISTRATOR]), UserController.createUser);
router.put('/:id', requireRole([RoleName.ADMINISTRATOR]), UserController.updateUser);
router.delete('/:id', requireRole([RoleName.ADMINISTRATOR]), UserController.deleteUser);

export default router;
