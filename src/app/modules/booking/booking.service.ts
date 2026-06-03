import { Booking } from './booking.model';
import AppError from '../../utils/AppError';

// Create a new booking (user optional for guest bookings)
const createBooking = async (userId: string | null, payload: Record<string, unknown>) => {
    // Whitelist: only guest-writable schema fields are accepted.
    // status / adminNote / user are NOT settable from the request body.
    const data: Record<string, unknown> = {
        type: payload.type,
        serviceName: payload.serviceName,
        serviceId: payload.serviceId,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        details: payload.details,
        ...(userId && { user: userId }),
    };
    const booking = await Booking.create(data);
    return booking;
};

// Get all bookings (admin) - optional filter by type/status
const getAllBookings = async (query: Record<string, string>) => {
    const filter: Record<string, string> = {};
    if (query.type) filter.type = query.type;
    if (query.status) filter.status = query.status;

    const bookings = await Booking.find(filter)
        .populate('user', 'name email phone profileImage')
        .sort({ createdAt: -1 });
    return bookings;
};

// Get bookings for a specific user
const getMyBookings = async (userId: string) => {
    const bookings = await Booking.find({ user: userId }).sort({ createdAt: -1 });
    return bookings;
};

// Update booking status (admin)
const updateBookingStatus = async (
    id: string,
    status: string,
    adminNote?: string
) => {
    const booking = await Booking.findByIdAndUpdate(
        id,
        { status, ...(adminNote && { adminNote }) },
        { new: true, runValidators: true }
    );
    if (!booking) throw new AppError(404, 'Booking not found');
    return booking;
};

// Delete booking (admin)
const deleteBooking = async (id: string) => {
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) throw new AppError(404, 'Booking not found');
    return booking;
};

export const BookingService = {
    createBooking,
    getAllBookings,
    getMyBookings,
    updateBookingStatus,
    deleteBooking,
};
