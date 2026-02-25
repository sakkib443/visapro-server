// ===================================================================
// VisaPro - Country Validation
// Zod validation schemas for Country module
// দেশ মডিউলের ভ্যালিডেশন স্কিমা
// ===================================================================

import { z } from 'zod';

const documentRequirementSchema = z.object({
    title: z.string().min(1, 'Document title is required'),
    titleBn: z.string().optional(),
    description: z.string().optional(),
    descriptionBn: z.string().optional(),
    isRequired: z.boolean().default(true),
});

const visaTypeSchema = z.object({
    name: z.string().min(1, 'Visa type name is required'),
    nameBn: z.string().optional(),
    processingTime: z.string().optional(),
    processingTimeBn: z.string().optional(),
    fee: z.number().min(0).optional(),
    governmentFee: z.number().min(0).optional(),
    duration: z.string().optional(),
    durationBn: z.string().optional(),
    entryType: z.enum(['single', 'multiple']).default('single'),
    isAvailable: z.boolean().default(true),
});

const embassyInfoSchema = z.object({
    name: z.string().optional(),
    nameBn: z.string().optional(),
    address: z.string().optional(),
    addressBn: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    website: z.string().optional(),
    workingHours: z.string().optional(),
    workingHoursBn: z.string().optional(),
    mapUrl: z.string().optional(),
});

/**
 * Create Country Validation Schema
 */
const createCountrySchema = z.object({
    body: z.object({
        name: z
            .string({ required_error: 'Country name is required' })
            .min(2, 'Name must be at least 2 characters')
            .max(100, 'Name cannot exceed 100 characters'),
        nameBn: z.string().max(100).optional(),
        flag: z.string().optional(),
        image: z.string().url('Invalid image URL').optional().or(z.literal('')),
        region: z.string().optional(),
        regionBn: z.string().optional(),
        capital: z.string().optional(),
        capitalBn: z.string().optional(),
        currency: z.string().optional(),
        timezone: z.string().optional(),
        touristsPerYear: z.string().optional(),
        description: z.string().max(2000).optional(),
        descriptionBn: z.string().max(2000).optional(),
        visaTypes: z.array(visaTypeSchema).default([]),
        documentRequirements: z.array(documentRequirementSchema).default([]),
        embassyInfo: embassyInfoSchema.optional(),
        startingPrice: z.number().min(0).optional(),
        submissionType: z.enum(['e-visa', 'in-person', 'flexible']).default('in-person'),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        isActive: z.boolean().default(true),
        isFeatured: z.boolean().default(false),
        order: z.number().min(0).default(0),
    }),
});

/**
 * Update Country Validation Schema
 */
const updateCountrySchema = z.object({
    body: z.object({
        name: z.string().min(2).max(100).optional(),
        nameBn: z.string().max(100).optional(),
        flag: z.string().optional(),
        image: z.string().url('Invalid image URL').optional().or(z.literal('')),
        region: z.string().optional(),
        regionBn: z.string().optional(),
        capital: z.string().optional(),
        capitalBn: z.string().optional(),
        currency: z.string().optional(),
        timezone: z.string().optional(),
        touristsPerYear: z.string().optional(),
        description: z.string().max(2000).optional(),
        descriptionBn: z.string().max(2000).optional(),
        visaTypes: z.array(visaTypeSchema).optional(),
        documentRequirements: z.array(documentRequirementSchema).optional(),
        embassyInfo: embassyInfoSchema.optional(),
        startingPrice: z.number().min(0).optional(),
        submissionType: z.enum(['e-visa', 'in-person', 'flexible']).optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        isActive: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
        order: z.number().min(0).optional(),
    }),
});

export const CountryValidation = {
    createCountrySchema,
    updateCountrySchema,
};
