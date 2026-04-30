// ===================================================================
// VisaPro - Contact & Social Settings Model (singleton document)
// ===================================================================

import { Schema, model } from 'mongoose';
import { ISettings, SettingsModel } from './settings.interface';

const socialSchema = new Schema(
    {
        facebook: { type: String, default: '', trim: true },
        instagram: { type: String, default: '', trim: true },
        twitter: { type: String, default: '', trim: true },
        youtube: { type: String, default: '', trim: true },
        linkedin: { type: String, default: '', trim: true },
        tiktok: { type: String, default: '', trim: true },
    },
    { _id: false }
);

const settingsSchema = new Schema<ISettings, SettingsModel>(
    {
        // Contact
        contactPhone: { type: String, required: true, trim: true },
        contactPhoneAlt: { type: String, default: '', trim: true },
        contactEmail: { type: String, required: true, trim: true, lowercase: true },
        whatsappNumber: { type: String, required: true, trim: true },
        address: { type: String, default: '', trim: true },
        addressBn: { type: String, default: '', trim: true },

        // Social
        social: { type: socialSchema, default: () => ({}) },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Settings = model<ISettings, SettingsModel>('Settings', settingsSchema);
