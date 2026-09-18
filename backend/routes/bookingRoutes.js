import express from 'express';
import {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus,
  cancelBooking,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/owner-requests', protect, authorize('owner', 'admin'), getOwnerBookings);
router.put('/:id/status', protect, authorize('owner', 'admin'), updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

export default router;
