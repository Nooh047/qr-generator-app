import express from 'express';
import { handleDynamicRedirect } from '../controllers/redirectController';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

/**
 * Main entrance router for all QR Codes out in the wild.
 * Avoids auth middleware explicitly to allow public scanning.
 */
router.get('/:shortId', asyncHandler(handleDynamicRedirect));

export default router;
