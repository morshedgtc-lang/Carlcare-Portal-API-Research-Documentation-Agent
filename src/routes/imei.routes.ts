import { Router } from 'express';
import { imeiController } from '../controllers/imei.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import { imeiSearchSchema, imeiSubmitSchema } from '../schemas';

const router = Router();

router.post('/search', authenticate, validate(imeiSearchSchema), asyncHandler(imeiController.search));
router.get('/:imei', authenticate, asyncHandler(imeiController.getByImei));

export default router;
