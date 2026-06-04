// ===================================================================
// VisaPro - Message Validation (Zod)
// ===================================================================

import { z } from 'zod';

const createMessageSchema = z.object({
    body: z.object({
        firstName: z
            .string({ required_error: 'First name is required' })
            .min(1, 'First name is required'),
        lastName: z.string().optional(),
        email: z
            .string({ required_error: 'Email is required' })
            .email('A valid email is required'),
        subject: z
            .string({ required_error: 'Subject is required' })
            .min(1, 'Subject is required'),
        message: z
            .string({ required_error: 'Message is required' })
            .min(1, 'Message is required'),
    }),
});

const updateMessageStatusSchema = z.object({
    body: z.object({
        status: z.enum(['unread', 'read', 'replied'], {
            required_error: 'Status is required',
        }),
    }),
});

export const MessageValidation = {
    createMessageSchema,
    updateMessageStatusSchema,
};
