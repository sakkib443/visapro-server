// ===================================================================
// VisaPro - Air Ticket Validation (Zod)
// ===================================================================

import { z } from 'zod';

const createAirTicketSchema = z.object({
    body: z.object({
        passengerName: z
            .string({ required_error: 'Passenger name is required' })
            .min(1, 'Passenger name is required'),
        phone: z.string().optional(),
        airline: z.string().optional(),
        from: z
            .string({ required_error: 'From is required' })
            .min(1, 'From is required'),
        to: z
            .string({ required_error: 'To is required' })
            .min(1, 'To is required'),
        departureDate: z.string().optional(),
        returnDate: z.string().optional(),
        class: z.enum(['Economy', 'Business', 'First']).optional(),
        price: z.number().optional(),
        status: z.enum(['pending', 'confirmed', 'cancelled']).optional(),
        ticketId: z.string().optional(),
    }),
});

const updateAirTicketSchema = z.object({
    body: z.object({
        passengerName: z.string().min(1, 'Passenger name is required').optional(),
        phone: z.string().optional(),
        airline: z.string().optional(),
        from: z.string().min(1, 'From is required').optional(),
        to: z.string().min(1, 'To is required').optional(),
        departureDate: z.string().optional(),
        returnDate: z.string().optional(),
        class: z.enum(['Economy', 'Business', 'First']).optional(),
        price: z.number().optional(),
        status: z.enum(['pending', 'confirmed', 'cancelled']).optional(),
        ticketId: z.string().optional(),
    }),
});

export const AirTicketValidation = {
    createAirTicketSchema,
    updateAirTicketSchema,
};
