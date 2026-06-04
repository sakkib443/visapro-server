// ===================================================================
// VisaPro - Visa Application Validation (Zod)
// ===================================================================

import { z } from 'zod';

const createVisaApplicationSchema = z.object({
    body: z.object({
        firstName: z
            .string({ required_error: 'First name is required' })
            .min(1, 'First name is required'),
        lastName: z
            .string({ required_error: 'Last name is required' })
            .min(1, 'Last name is required'),
        email: z.string().email('A valid email is required').optional().or(z.literal('')),
        phone: z.string().optional(),
        passportNo: z.string().optional(),
        visaType: z
            .string({ required_error: 'Visa type is required' })
            .min(1, 'Visa type is required'),
        country: z
            .string({ required_error: 'Country is required' })
            .min(1, 'Country is required'),
        fee: z.number().optional(),
        notes: z.string().optional(),
        status: z.enum(['pending', 'processing', 'approved', 'rejected']).optional(),
        applicationId: z.string().optional(),
        appliedDate: z.string().optional(),
    }),
});

const updateVisaApplicationSchema = z.object({
    body: z.object({
        firstName: z.string().min(1, 'First name is required').optional(),
        lastName: z.string().min(1, 'Last name is required').optional(),
        email: z.string().email('A valid email is required').optional().or(z.literal('')),
        phone: z.string().optional(),
        passportNo: z.string().optional(),
        visaType: z.string().min(1, 'Visa type is required').optional(),
        country: z.string().min(1, 'Country is required').optional(),
        fee: z.number().optional(),
        notes: z.string().optional(),
        status: z.enum(['pending', 'processing', 'approved', 'rejected']).optional(),
        appliedDate: z.string().optional(),
    }),
});

export const VisaApplicationValidation = {
    createVisaApplicationSchema,
    updateVisaApplicationSchema,
};
