import { Schema, model } from 'mongoose';
import { IBooking, BookingModel } from './booking.interface';

const bookingSchema = new Schema<IBooking, BookingModel>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        type: {
            type: String,
            enum: ['visa', 'hotel', 'tour', 'hajj', 'study'],
            required: true,
        },
        serviceName: { type: String, required: true, trim: true },
        serviceId: { type: String },

        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, required: true, trim: true },

        details: { type: Schema.Types.Mixed, default: {} },

        status: {
            type: String,
            enum: ['pending', 'processing', 'confirmed', 'cancelled', 'rejected'],
            default: 'pending',
        },
        adminNote: { type: String },
    },
    { timestamps: true, versionKey: false }
);

bookingSchema.index({ user: 1 });
bookingSchema.index({ type: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

export const Booking = model<IBooking, BookingModel>('Booking', bookingSchema);
