// ===================================================================
// VisaPro - Visa Document Interface
// ভিসা ডকুমেন্ট মডিউলের TypeScript interface
// ===================================================================

import { Model, Types } from 'mongoose';

/**
 * IVisaDocument - Main Visa Document Interface
 */
export interface IVisaDocument {
    _id?: Types.ObjectId;

    // ==================== User Reference ====================
    user: Types.ObjectId; // কোন ইউজারের ডকুমেন্ট

    // ==================== Applicant Info ====================
    applicantName: string;
    applicantNameBn?: string;
    phone?: string;
    passportNo?: string;

    // ==================== Visa Details ====================
    visaType?: string; // Tourist / Student / Business / Work / Medical
    country?: string; // কোন দেশের ভিসা
    visaNo?: string;
    issueDate?: Date;
    expiryDate?: Date;
    entryType?: 'single' | 'multiple';

    // ==================== Documents ====================
    images?: string[]; // Cloudinary URLs (ভিসার scan images)

    // ==================== Notes ====================
    notes?: string;

    // ==================== Status ====================
    status: 'pending' | 'processing' | 'delivered';

    // ==================== Admin Reference ====================
    createdBy?: Types.ObjectId; // কোন admin তৈরি করেছে

    // ==================== Timestamps ====================
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * IVisaDocumentFilters - Query Filters
 */
export interface IVisaDocumentFilters {
    searchTerm?: string;
    user?: string;
    status?: string;
    country?: string;
    visaType?: string;
}

/**
 * VisaDocumentModel - Mongoose Model Type
 */
export interface VisaDocumentModel extends Model<IVisaDocument> {
    isDocumentExists(id: string): Promise<boolean>;
}
