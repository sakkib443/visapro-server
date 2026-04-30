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
