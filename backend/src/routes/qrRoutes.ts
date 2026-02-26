import express from 'express';
import { createQR, getMyQRs, getQRById, updateQR, deleteQR } from '../controllers/qrController';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.post('/', optionalAuth, asyncHandler(createQR));
router.get('/', requireAuth, asyncHandler(getMyQRs));
router.get('/:id', requireAuth, asyncHandler(getQRById));
router.put('/:id', requireAuth, asyncHandler(updateQR));
router.delete('/:id', requireAuth, asyncHandler(deleteQR));

export default router;
