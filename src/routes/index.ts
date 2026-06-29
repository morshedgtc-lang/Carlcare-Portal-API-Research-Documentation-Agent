import { Router } from 'express';
import authRoutes from './auth.routes';
import imeiRoutes from './imei.routes';
import serviceRoutes from './service.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/imei', imeiRoutes);
router.use('/service', serviceRoutes);
router.use('/admin', adminRoutes);

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'IMEI Lookup API is running', timestamp: new Date().toISOString() });
});

export default router;
