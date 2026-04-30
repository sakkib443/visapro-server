// ===================================================================
// VisaPro - Settings Validation (Zod)
// ===================================================================

import { z } from 'zod';

const updateSettingsSchema = z.object({
    body: z.object({
        contactPhone: z.string().trim().min(5).max(50).optional(),
        contactPhoneAlt: z.string().trim().max(50).optional().or(z.literal('')),
        contactEmail: z.string().trim().email().optional(),
        whatsappNumber: z.string().trim().min(5).max(20).optional(),
        address: z.string().trim().max(300).optional().or(z.literal('')),
        addressBn: z.string().trim().max(300).optional().or(z.literal('')),
        social: z
            .object({
                facebook: z.string().trim().max(300).optional().or(z.literal('')),
                instagram: z.string().trim().max(300).optional().or(z.literal('')),
                twitter: z.string().trim().max(300).optional().or(z.literal('')),
                youtube: z.string().trim().max(300).optional().or(z.literal('')),
                linkedin: z.string().trim().max(300).optional().or(z.literal('')),
                tiktok: z.string().trim().max(300).optional().or(z.literal('')),
            })
            .partial()
            .optional(),
    }),
});

export const SettingsValidation = {
    updateSettingsSchema,
};
