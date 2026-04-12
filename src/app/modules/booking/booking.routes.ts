import express from 'express';
import { BookingController } from './booking.controller';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';

const router = express.Router();

// ── User: submit booking (must be logged in)
router.post('/', authMiddleware, BookingController.createBooking);

// ── User: see own bookings
router.get('/my', authMiddleware, BookingController.getMyBookings);

// ── Admin: all bookings (filter by ?type=visa&status=pending)
router.get('/', authMiddleware, authorizeRoles('admin'), BookingController.getAllBookings);

// ── Admin: update status
router.patch('/:id/status', authMiddleware, authorizeRoles('admin'), BookingController.updateStatus);

// ── Admin: delete
router.delete('/:id', authMiddleware, authorizeRoles('admin'), BookingController.deleteBooking);

export const BookingRoutes = router;
