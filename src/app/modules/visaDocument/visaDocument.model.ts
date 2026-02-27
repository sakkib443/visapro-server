// ===================================================================
// VisaPro - Visa Document Model
// ভিসা ডকুমেন্ট মডিউলের Mongoose স্কিমা
// ===================================================================

import { Schema, model, Types } from 'mongoose';
import { IVisaDocument, VisaDocumentModel } from './visaDocument.interface';

// ==================== Visa Document Schema ====================
const visaDocumentSchema = new Schema<IVisaDocument, VisaDocumentModel>(
    {
        // User Reference
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User reference is required'],
        },

        // Applicant Info
        applicantName: {
            type: String,
            required: [true, 'Applicant name is required'],
            trim: true,
            maxlength: [200, 'Name cannot exceed 200 characters'],
        },
        applicantNameBn: { type: String, trim: true },
        phone: { type: String, trim: true },
        passportNo: { type: String, trim: true },

        // Visa Details
        visaType: {
            type: String,
            trim: true,
        },
        country: { type: String, trim: true },
        visaNo: { type: String, trim: true },
        issueDate: { type: Date },
        expiryDate: { type: Date },
        entryType: {
            type: String,
            enum: ['single', 'multiple'],
            default: 'single',
        },

        // Documents (Cloudinary image URLs)
        images: [{ type: String }],

        // Notes
        notes: {
            type: String,
            maxlength: [2000, 'Notes cannot exceed 2000 characters'],
        },

        // Status
        status: {
            type: String,
            enum: ['pending', 'processing', 'delivered'],
            default: 'pending',
        },

        // Admin Reference
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// ==================== Indexes ====================
visaDocumentSchema.index({ user: 1 });
visaDocumentSchema.index({ status: 1 });
visaDocumentSchema.index({ createdBy: 1 });
visaDocumentSchema.index({ country: 1 });
visaDocumentSchema.index({ createdAt: -1 });

// ==================== Static Methods ====================
visaDocumentSchema.statics.isDocumentExists = async function (id: string): Promise<boolean> {
    const doc = await this.findById(id);
    return !!doc;
};

// ==================== Export Model ====================
export const VisaDocument = model<IVisaDocument, VisaDocumentModel>('VisaDocument', visaDocumentSchema);
