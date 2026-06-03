import express from 'express';
import { BookingController } from './booking.controller';
import { BookingValidation } from './booking.validation';
import { authMiddleware, authorizeRoles, optionalAuth } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

// ── Anyone can submit booking (auth optional for auto-fill)
router.post(
    '/',
    optionalAuth,
    validateRequest(BookingValidation.createBookingSchema),
    BookingController.createBooking
);

// ── User: see own bookings
router.get('/my', authMiddleware, BookingController.getMyBookings);

// ── Admin: all bookings (filter by ?type=visa&status=pending)
router.get('/', authMiddleware, authorizeRoles('admin'), BookingController.getAllBookings);

// ── Admin: update status
router.patch('/:id/status', authMiddleware, authorizeRoles('admin'), BookingController.updateStatus);

// ── Admin: delete
router.delete('/:id', authMiddleware, authorizeRoles('admin'), BookingController.deleteBooking);

export const BookingRoutes = router;
