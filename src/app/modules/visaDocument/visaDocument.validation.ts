// ===================================================================
// VisaPro - Visa Document Validation
// Zod validation schemas for Visa Document module
// ===================================================================

import { z } from 'zod';

const createVisaDocumentSchema = z.object({
    body: z.object({
        user: z.string({ required_error: 'User ID is required' }),
        applicantName: z.string({ required_error: 'Applicant name is required' }).min(1).max(200),
        applicantNameBn: z.string().optional(),
        phone: z.string().optional(),
        passportNo: z.string().optional(),
        visaType: z.string().optional(),
        country: z.string().optional(),
        visaNo: z.string().optional(),
        issueDate: z.string().optional(),
        expiryDate: z.string().optional(),
        entryType: z.enum(['single', 'multiple']).optional(),
        images: z.array(z.string()).optional(),
        notes: z.string().max(2000).optional(),
        status: z.enum(['pending', 'processing', 'delivered']).optional(),
    }),
});

const updateVisaDocumentSchema = z.object({
    body: z.object({
        applicantName: z.string().min(1).max(200).optional(),
        applicantNameBn: z.string().optional(),
        phone: z.string().optional(),
        passportNo: z.string().optional(),
        visaType: z.string().optional(),
        country: z.string().optional(),
        visaNo: z.string().optional(),
        issueDate: z.string().optional(),
        expiryDate: z.string().optional(),
        entryType: z.enum(['single', 'multiple']).optional(),
        images: z.array(z.string()).optional(),
        notes: z.string().max(2000).optional(),
        status: z.enum(['pending', 'processing', 'delivered']).optional(),
    }),
});

export const VisaDocumentValidation = {
    createVisaDocumentSchema,
    updateVisaDocumentSchema,
};
