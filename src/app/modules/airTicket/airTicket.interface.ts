import { Model } from 'mongoose';

export type TAirTicketClass = 'Economy' | 'Business' | 'First';
export type TAirTicketStatus = 'pending' | 'confirmed' | 'cancelled';

export interface IAirTicket {
    // Passenger / contact
    passengerName: string;
    phone?: string;

    // Flight
    airline?: string;
    from: string;
    to: string;
    departureDate?: string;
    returnDate?: string;
    class: TAirTicketClass;
    price: number;

    // Admin
    status: TAirTicketStatus;
    ticketId: string;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface AirTicketModel extends Model<IAirTicket> {}
