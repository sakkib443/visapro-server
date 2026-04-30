// ===================================================================
// VisaPro - Settings Service
// Singleton: শুধু একটাই document থাকবে — find করে না পেলে create করবে
// ===================================================================

import { Settings } from './settings.model';
import { ISettings } from './settings.interface';

const DEFAULTS: Partial<ISettings> = {
    contactPhone: '+8801712114770',
    contactPhoneAlt: '',
    contactEmail: 'support@visapro.com.bd',
    whatsappNumber: '8801712114770',
    address: '25/4, 4th Floor, Panthpath, Dhaka',
    addressBn: '২৫/৪, ৪র্থ তলা, পান্থপথ, ঢাকা',

    // Working Hours
    workingDays: 'Sat - Thu: Open',
    workingDaysBn: 'শনি - বৃহঃ: খোলা',
    workingHours: '9:30 AM - 8:30 PM',
    workingHoursBn: 'সকাল ৯:৩০ - রাত ৮:৩০',

    // Map
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902633038936!2d90.38531!3d23.7508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b0acc6aed9%3A0xc3f8e58f00d3d540!2sPanthapath%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1704000000000!5m2!1sen!2sbd',
    mapLabel: 'PANTHPATH, DHAKA',
    mapLabelBn: 'পান্থপথ, ঢাকা',

    // Stats
    visaSuccessRate: '98%',
    countriesCount: '50+',
    happyClientsCount: '10K+',

    social: {
        facebook: 'https://facebook.com/visapro',
        instagram: '',
        twitter: '',
        youtube: '',
        linkedin: '',
        tiktok: '',
    },
};

/**
 * Get the singleton settings document. Create with defaults if missing.
 */
const getSettings = async (): Promise<ISettings> => {
    let doc = await Settings.findOne();
    if (!doc) {
        doc = await Settings.create(DEFAULTS);
    }
    return doc;
};

/**
 * Update settings. Always operates on the singleton.
 */
const updateSettings = async (
    payload: Partial<ISettings>
): Promise<ISettings> => {
    let doc = await Settings.findOne();
    if (!doc) {
        doc = await Settings.create({ ...DEFAULTS, ...payload });
        return doc;
    }
    // Merge social separately so partial updates don't wipe other fields
    if (payload.social) {
        doc.social = { ...doc.social, ...payload.social };
    }
    const { social: _ignore, ...rest } = payload as Record<string, unknown>;
    Object.assign(doc, rest);
    await doc.save();
    return doc;
};

export const SettingsService = { getSettings, updateSettings };
