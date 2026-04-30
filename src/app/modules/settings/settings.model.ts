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

        // Working Hours
        workingDays: { type: String, default: 'Sat - Thu: Open', trim: true },
        workingDaysBn: { type: String, default: 'শনি - বৃহঃ: খোলা', trim: true },
        workingHours: { type: String, default: '9:30 AM - 8:30 PM', trim: true },
        workingHoursBn: { type: String, default: 'সকাল ৯:৩০ - রাত ৮:৩০', trim: true },

        // Map
        mapEmbedUrl: { type: String, default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902633038936!2d90.38531!3d23.7508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b0acc6aed9%3A0xc3f8e58f00d3d540!2sPanthapath%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1704000000000!5m2!1sen!2sbd', trim: true },
        mapLabel: { type: String, default: 'PANTHPATH, DHAKA', trim: true },
        mapLabelBn: { type: String, default: 'পান্থপথ, ঢাকা', trim: true },

        // Stats
        visaSuccessRate: { type: String, default: '98%', trim: true },
        countriesCount: { type: String, default: '50+', trim: true },
        happyClientsCount: { type: String, default: '10K+', trim: true },

        // Social
        social: { type: socialSchema, default: () => ({}) },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Settings = model<ISettings, SettingsModel>('Settings', settingsSchema);
