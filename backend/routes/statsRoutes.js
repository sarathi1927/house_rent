import express from 'express';
import { getPlatformStats, getOwnerStats } from '../controllers/statsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/platform', getPlatformStats);
router.get('/owner', protect, authorize('owner', 'admin'), getOwnerStats);

export default router;
