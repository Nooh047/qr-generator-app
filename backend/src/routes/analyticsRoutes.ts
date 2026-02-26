import express from 'express';
import { getDashboardSummary, getQRSpecificAnalytics } from '../controllers/analyticsController';
import { requireAuth } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.use(requireAuth);

router.get('/dashboard', asyncHandler(getDashboardSummary));
router.get('/qr/:qrId', asyncHandler(getQRSpecificAnalytics));

export default router;
