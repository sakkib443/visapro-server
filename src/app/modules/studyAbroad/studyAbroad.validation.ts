// ===================================================================
// VisaPro - Study Abroad Validation (Zod)
// ===================================================================

import { z } from 'zod';

const createStudyAbroadSchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: 'Name is required' })
            .min(1, 'Name is required'),
        country: z
            .string({ required_error: 'Country is required' })
            .min(1, 'Country is required'),
        university: z
            .string({ required_error: 'University is required' })
            .min(1, 'University is required'),
        degree: z.string().optional(),
        duration: z.string().optional(),
        tuition: z.number().optional(),
        deadline: z.string().optional(),
        requirements: z.string().optional(),
        scholarship: z.string().optional(),
        status: z.enum(['open', 'closed']).optional(),
        applications: z.number().optional(),
    }),
});

const updateStudyAbroadSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required').optional(),
        country: z.string().min(1, 'Country is required').optional(),
        university: z.string().min(1, 'University is required').optional(),
        degree: z.string().optional(),
        duration: z.string().optional(),
        tuition: z.number().optional(),
        deadline: z.string().optional(),
        requirements: z.string().optional(),
        scholarship: z.string().optional(),
        status: z.enum(['open', 'closed']).optional(),
        applications: z.number().optional(),
    }),
});

export const StudyAbroadValidation = {
    createStudyAbroadSchema,
    updateStudyAbroadSchema,
};
