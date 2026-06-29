import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { updateStatusSchema } from '../schemas';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', asyncHandler(adminController.getDashboard));
router.get('/requests', asyncHandler(adminController.getAllRequests));
router.put('/request/:id', validate(updateStatusSchema), asyncHandler(adminController.updateRequest));
router.get('/search', asyncHandler(adminController.searchImei));
router.get('/users', asyncHandler(adminController.getUsers));
router.get('/export', asyncHandler(adminController.exportCsv));
router.get('/logs', asyncHandler(adminController.getLogs));
router.get('/charts', asyncHandler(adminController.getChartData));

export default router;
