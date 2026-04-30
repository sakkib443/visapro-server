// ===================================================================
// VisaPro - Country Interface
// Country module TypeScript interface definitions
// দেশ মডিউলের TypeScript interface definitions
// ===================================================================

import { Model, Types } from 'mongoose';

/**
 * IDocumentRequirement - Document requirement for visa
 * ভিসার জন্য ডকুমেন্ট প্রয়োজনীয়তা
 */
export interface IDocumentRequirement {
    title: string;                    // e.g. "Passport"
    titleBn?: string;                 // e.g. "পাসপোর্ট"
    description?: string;             // Detail about this requirement
    descriptionBn?: string;           // Bengali detail
    isRequired: boolean;              // Mandatory or optional
}

/**
 * IVisaType - Visa types available for this country
 * এই দেশের জন্য উপলব্ধ ভিসার ধরন
 */
export interface IVisaType {
    categorySlug?: string;            // Reference to VisaCategory.slug e.g. "tourist-visa"
    name: string;                     // Country-specific name e.g. "Visitor Visa (600)"
    nameBn?: string;                  // e.g. "ভিজিটর ভিসা"
    processingTime?: string;          // e.g. "5-7 Days"
    processingTimeBn?: string;
    fee?: number;                     // Service fee in BDT
    governmentFee?: number;           // Government/Embassy fee
    duration?: string;                // e.g. "30 Days"
    durationBn?: string;
    entryType?: 'single' | 'multiple'; // Entry type
    isAvailable: boolean;
}

/**
 * IEmbassyInfo - Embassy/Consulate details
 * দূতাবাস/কনসুলেটের তথ্য
 */
export interface IEmbassyInfo {
    name?: string;                    // Embassy name
    nameBn?: string;
    address?: string;                 // Physical address
    addressBn?: string;
    phone?: string;
    email?: string;
    website?: string;
    workingHours?: string;            // e.g. "Sun-Thu, 9AM-4PM"
    workingHoursBn?: string;
    mapUrl?: string;                  // Google Maps link
}

/**
 * ICountry - Main Country Interface
 * Database এ যে format এ country data save হবে
 */
export interface ICountry {
    _id?: Types.ObjectId;

    // ==================== Basic Info ====================
    name: string;                     // Country name (English) e.g. "Singapore"
    nameBn?: string;                  // Country name (Bengali) e.g. "সিঙ্গাপুর"
    slug: string;                     // URL friendly slug e.g. "singapore"
    flag?: string;                    // Flag emoji or image URL e.g. "🇸🇬"
    image?: string;                   // Country hero image URL
    region?: string;                  // e.g. "Asian", "European"
    regionBn?: string;                // e.g. "এশিয়ান"
    capital?: string;                 // Capital city
    capitalBn?: string;
    currency?: string;                // e.g. "SGD"
    timezone?: string;                // e.g. "GMT+8"
    touristsPerYear?: string;         // e.g. "19.1M"

    // ==================== Visa Details ====================
    description?: string;             // Short description about visa for this country
    descriptionBn?: string;
    visaTypes: IVisaType[];           // Available visa types
    documentRequirements: IDocumentRequirement[]; // Required documents
    embassyInfo?: IEmbassyInfo;       // Embassy details in Bangladesh

    // ==================== Pricing ====================
    startingPrice?: number;           // Starting price in BDT
    submissionType?: 'e-visa' | 'in-person' | 'flexible'; // How to submit

    // ==================== SEO ====================
    metaTitle?: string;
    metaDescription?: string;

    // ==================== Status & Order ====================
    isActive: boolean;
    isFeatured: boolean;
    order: number;

    // ==================== Timestamps ====================
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * ICountryFilters - Query Filters
 * Country list filter করার জন্য
 */
export interface ICountryFilters {
    searchTerm?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    region?: string;
    submissionType?: string;
}

/**
 * CountryModel - Mongoose Model Type
 */
export interface CountryModel extends Model<ICountry> {
    isCountryExists(id: string): Promise<boolean>;
    findBySlug(slug: string): Promise<ICountry | null>;
}
