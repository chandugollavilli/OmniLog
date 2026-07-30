import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import deviceRoutes from './deviceRoutes';
import logRoutes from './logRoutes';
import dashboardRoutes from './dashboardRoutes';
import alertRoutes from './alertRoutes';
import reportRoutes from './reportRoutes';
import auditRoutes from './auditRoutes';
import healthRoutes from './healthRoutes';
import aiRoutes from './aiRoutes';
import incidentRoutes from './incidentRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/devices', deviceRoutes);
router.use('/logs', logRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/alerts', alertRoutes);
router.use('/reports', reportRoutes);
router.use('/audit', auditRoutes);
router.use('/health', healthRoutes);
router.use('/ai', aiRoutes);
router.use('/incidents', incidentRoutes);

export default router;
