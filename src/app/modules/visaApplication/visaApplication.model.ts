import { Schema, model } from 'mongoose';
import { IVisaApplication, VisaApplicationModel } from './visaApplication.interface';

const visaApplicationSchema = new Schema<IVisaApplication, VisaApplicationModel>(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, trim: true, lowercase: true },
        phone: { type: String, trim: true },
        passportNo: { type: String, trim: true },

        visaType: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
        fee: { type: Number, default: 0 },
        notes: { type: String },

        status: {
            type: String,
            enum: ['pending', 'processing', 'approved', 'rejected'],
            default: 'pending',
        },

        applicationId: { type: String, required: true, trim: true },
        appliedDate: { type: String },
    },
    { timestamps: true, versionKey: false }
);

visaApplicationSchema.index({ applicationId: 1 });
visaApplicationSchema.index({ status: 1 });
visaApplicationSchema.index({ country: 1 });
visaApplicationSchema.index({ createdAt: -1 });

export const VisaApplication = model<IVisaApplication, VisaApplicationModel>(
    'VisaApplication',
    visaApplicationSchema
);
