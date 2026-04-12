import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingService } from './booking.service';

// POST /api/bookings  → user creates booking
const createBooking = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const booking = await BookingService.createBooking(userId, req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Booking submitted successfully',
        data: booking,
    });
});

// GET /api/bookings  → admin gets all
const getAllBookings = catchAsync(async (req: Request, res: Response) => {
    const bookings = await BookingService.getAllBookings(req.query as Record<string, string>);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Bookings retrieved',
        data: bookings,
    });
});

// GET /api/bookings/my  → logged in user sees their own
const getMyBookings = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const bookings = await BookingService.getMyBookings(userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'My bookings retrieved',
        data: bookings,
    });
});

// PATCH /api/bookings/:id/status  → admin updates status
const updateStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, adminNote } = req.body;
    const booking = await BookingService.updateBookingStatus(id, status, adminNote);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Booking status updated',
        data: booking,
    });
});

// DELETE /api/bookings/:id  → admin deletes
const deleteBooking = catchAsync(async (req: Request, res: Response) => {
    await BookingService.deleteBooking(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Booking deleted',
        data: null,
    });
});

export const BookingController = {
    createBooking,
    getAllBookings,
    getMyBookings,
    updateStatus,
    deleteBooking,
};
