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

    // Working Hours
    workingDays: string;      // e.g. "Sat - Thu: Open"
    workingDaysBn?: string;   // e.g. "শনি - বৃহঃ: খোলা"
    workingHours: string;     // e.g. "9:30 AM - 8:30 PM"
    workingHoursBn?: string;  // e.g. "সকাল ৯:৩০ - রাত ৮:৩০"

    // Map
    mapEmbedUrl?: string;     // Google Maps embed URL
    mapLabel: string;         // e.g. "PANTHPATH, DHAKA"
    mapLabelBn?: string;      // e.g. "পান্থপথ, ঢাকা"

    // Stats
    visaSuccessRate: string;  // e.g. "98%"
    countriesCount: string;   // e.g. "50+"
    happyClientsCount: string; // e.g. "10K+"

    // Social
    social: ISocialLinks;

    createdAt: Date;
    updatedAt: Date;
}

export type SettingsModel = Model<ISettings>;
