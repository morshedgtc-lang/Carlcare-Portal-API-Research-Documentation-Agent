import { Router } from 'express';
import { imeiController } from '../controllers/imei.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { imeiSubmitSchema } from '../schemas';

const router = Router();

router.use(authenticate);

router.post('/submit', validate(imeiSubmitSchema), asyncHandler(imeiController.submit));
router.get('/status/:imei', asyncHandler(imeiController.getStatus));
router.get('/my-requests', asyncHandler(imeiController.getMyRequests));

export default router;
