// ===================================================================
// VisaPro - Contact & Social Settings Interface (singleton)
// সাইটের সব contact info + social link admin dashboard থেকে control হবে
// ===================================================================

import { Document, Model } from 'mongoose';

export interface ISocialLinks {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
    tiktok?: string;
}

export interface ISettings extends Document {
    // Contact
    contactPhone: string;
    contactPhoneAlt?: string;
    contactEmail: string;
    whatsappNumber: string; // digits only, e.g. "8801712114770"
    address: string;
    addressBn?: string;

    // Social
    social: ISocialLinks;

    createdAt: Date;
    updatedAt: Date;
}

export type SettingsModel = Model<ISettings>;
