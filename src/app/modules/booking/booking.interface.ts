import { Model, Types } from 'mongoose';

export type TBookingType = 'visa' | 'hotel' | 'tour' | 'hajj' | 'study';
export type TBookingStatus = 'pending' | 'processing' | 'confirmed' | 'cancelled' | 'rejected';

export interface IBooking {
    user: Types.ObjectId;
    type: TBookingType;

    // Service reference (name of visa country / hotel / tour / package)
    serviceName: string;
    serviceId?: string;

    // Contact info
    name: string;
    email: string;
    phone: string;

    // Type-specific fields (flexible)
    details: Record<string, string | number | boolean>;

    // Admin
    status: TBookingStatus;
    adminNote?: string;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface BookingModel extends Model<IBooking> {}
