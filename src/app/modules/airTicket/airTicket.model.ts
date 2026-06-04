import { Schema, model } from 'mongoose';
import { IAirTicket, AirTicketModel } from './airTicket.interface';

const airTicketSchema = new Schema<IAirTicket, AirTicketModel>(
    {
        passengerName: { type: String, required: true, trim: true },
        phone: { type: String, trim: true },

        airline: { type: String, trim: true },
        from: { type: String, required: true, trim: true },
        to: { type: String, required: true, trim: true },
        departureDate: { type: String },
        returnDate: { type: String },
        class: {
            type: String,
            enum: ['Economy', 'Business', 'First'],
            default: 'Economy',
        },
        price: { type: Number, default: 0 },

        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled'],
            default: 'pending',
        },
        ticketId: { type: String, required: true, trim: true },
    },
    { timestamps: true, versionKey: false }
);

airTicketSchema.index({ ticketId: 1 });
airTicketSchema.index({ status: 1 });
airTicketSchema.index({ createdAt: -1 });

export const AirTicket = model<IAirTicket, AirTicketModel>('AirTicket', airTicketSchema);
