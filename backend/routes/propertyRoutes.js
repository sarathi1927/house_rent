import express from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  reviewPropertyStatus,
  getMyProperties,
  getPendingProperties,
} from '../controllers/propertyController.js';
import {
  addReview,
  getPropertyReviews,
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.get('/:id/reviews', getPropertyReviews);

// Protected routes (Owner / Admin)
router.get('/user/my-properties', protect, authorize('owner', 'admin'), getMyProperties);
router.post('/', protect, authorize('owner', 'admin'), createProperty);
router.put('/:id', protect, authorize('owner', 'admin'), updateProperty);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteProperty);

// Admin Moderation routes
router.get('/admin/pending', protect, authorize('admin'), getPendingProperties);
router.put('/:id/status', protect, authorize('admin'), reviewPropertyStatus);

// Review routes
router.post('/:id/reviews', protect, addReview);

export default router;
