import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', authRateLimiter, AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);

export default router;
