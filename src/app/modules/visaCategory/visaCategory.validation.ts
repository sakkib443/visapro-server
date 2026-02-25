// ===================================================================
// VisaPro - Visa Category Validation
// Zod validation schemas for Visa Category module
// ভিসা ক্যাটাগরি মডিউলের ভ্যালিডেশন স্কিমা
// ===================================================================

import { z } from 'zod';

/**
 * Create Visa Category Validation Schema
 * নতুন ভিসা ক্যাটাগরি তৈরির জন্য ভ্যালিডেশন
 */
const createVisaCategorySchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: 'Category name is required',
            })
            .min(2, 'Name must be at least 2 characters')
            .max(100, 'Name cannot exceed 100 characters'),
        nameBn: z
            .string()
            .max(100, 'Bengali name cannot exceed 100 characters')
            .optional(),
        description: z
            .string()
            .max(500, 'Description cannot exceed 500 characters')
            .optional(),
        descriptionBn: z
            .string()
            .max(500, 'Bengali description cannot exceed 500 characters')
            .optional(),
        icon: z.string().optional(),
        image: z.string().url('Invalid image URL').optional().or(z.literal('')),
        isActive: z.boolean().default(true),
        order: z.number().min(0).default(0),
    }),
});

/**
 * Update Visa Category Validation Schema
 * ভিসা ক্যাটাগরি আপডেটের জন্য ভ্যালিডেশন
 */
const updateVisaCategorySchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(2, 'Name must be at least 2 characters')
            .max(100, 'Name cannot exceed 100 characters')
            .optional(),
        nameBn: z
            .string()
            .max(100, 'Bengali name cannot exceed 100 characters')
            .optional(),
        description: z
            .string()
            .max(500, 'Description cannot exceed 500 characters')
            .optional(),
        descriptionBn: z
            .string()
            .max(500, 'Bengali description cannot exceed 500 characters')
            .optional(),
        icon: z.string().optional(),
        image: z.string().url('Invalid image URL').optional().or(z.literal('')),
        isActive: z.boolean().optional(),
        order: z.number().min(0).optional(),
    }),
});

export const VisaCategoryValidation = {
    createVisaCategorySchema,
    updateVisaCategorySchema,
};
