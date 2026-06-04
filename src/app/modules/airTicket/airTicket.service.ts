import { AirTicket } from './airTicket.model';
import AppError from '../../utils/AppError';

// Generate a server-side ticket id (fallback when client does not send one)
const generateTicketId = () => `AT-${String(Date.now()).slice(-3)}`;

// Create a new air ticket booking (admin)
const createAirTicket = async (payload: Record<string, unknown>) => {
    // Whitelist: only schema fields are accepted — never spread req.body.
    const data: Record<string, unknown> = {
        passengerName: payload.passengerName,
        phone: payload.phone,
        airline: payload.airline,
        from: payload.from,
        to: payload.to,
        departureDate: payload.departureDate,
        returnDate: payload.returnDate,
        class: payload.class,
        price: payload.price,
        status: payload.status,
        ticketId: payload.ticketId || generateTicketId(),
    };
    const airTicket = await AirTicket.create(data);
    return airTicket;
};

// Get all air tickets (admin) - optional filter by status
const getAllAirTickets = async (query: Record<string, string>) => {
    const filter: Record<string, string> = {};
    if (query.status) filter.status = query.status;

    const airTickets = await AirTicket.find(filter).sort({ createdAt: -1 });
    return airTickets;
};

// Get a single air ticket by id (admin)
const getAirTicketById = async (id: string) => {
    const airTicket = await AirTicket.findById(id);
    if (!airTicket) throw new AppError(404, 'Air ticket not found');
    return airTicket;
};

// Update an air ticket incl. status (admin)
const updateAirTicket = async (id: string, payload: Record<string, unknown>) => {
    // Whitelist: only schema fields are accepted — never spread req.body.
    const data: Record<string, unknown> = {};
    if (payload.passengerName !== undefined) data.passengerName = payload.passengerName;
    if (payload.phone !== undefined) data.phone = payload.phone;
    if (payload.airline !== undefined) data.airline = payload.airline;
    if (payload.from !== undefined) data.from = payload.from;
    if (payload.to !== undefined) data.to = payload.to;
    if (payload.departureDate !== undefined) data.departureDate = payload.departureDate;
    if (payload.returnDate !== undefined) data.returnDate = payload.returnDate;
    if (payload.class !== undefined) data.class = payload.class;
    if (payload.price !== undefined) data.price = payload.price;
    if (payload.status !== undefined) data.status = payload.status;
    if (payload.ticketId !== undefined) data.ticketId = payload.ticketId;

    const airTicket = await AirTicket.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (!airTicket) throw new AppError(404, 'Air ticket not found');
    return airTicket;
};

// Delete an air ticket (admin)
const deleteAirTicket = async (id: string) => {
    const airTicket = await AirTicket.findByIdAndDelete(id);
    if (!airTicket) throw new AppError(404, 'Air ticket not found');
    return airTicket;
};

export const AirTicketService = {
    createAirTicket,
    getAllAirTickets,
    getAirTicketById,
    updateAirTicket,
    deleteAirTicket,
};
