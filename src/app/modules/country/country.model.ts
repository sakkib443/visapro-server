// ===================================================================
// VisaPro - Country Model
// Mongoose schema for Country module
// দেশ মডিউলের Mongoose স্কিমা
// ===================================================================

import { Schema, model } from 'mongoose';
import { ICountry, CountryModel } from './country.interface';

// ==================== Sub-schemas ====================

const documentRequirementSchema = new Schema(
    {
        title: { type: String, required: true },
        titleBn: { type: String },
        description: { type: String },
        descriptionBn: { type: String },
        isRequired: { type: Boolean, default: true },
    },
    { _id: false }
);

const visaTypeSchema = new Schema(
    {
        name: { type: String, required: true },
        nameBn: { type: String },
        processingTime: { type: String },
        processingTimeBn: { type: String },
        fee: { type: Number },
        governmentFee: { type: Number },
        duration: { type: String },
        durationBn: { type: String },
        entryType: {
            type: String,
            enum: ['single', 'multiple'],
            default: 'single',
        },
        isAvailable: { type: Boolean, default: true },
    },
    { _id: false }
);

const embassyInfoSchema = new Schema(
    {
        name: { type: String },
        nameBn: { type: String },
        address: { type: String },
        addressBn: { type: String },
        phone: { type: String },
        email: { type: String },
        website: { type: String },
        workingHours: { type: String },
        workingHoursBn: { type: String },
        mapUrl: { type: String },
    },
    { _id: false }
);

// ==================== Country Schema ====================
const countrySchema = new Schema<ICountry, CountryModel>(
    {
        // Basic Info
        name: {
            type: String,
            required: [true, 'Country name is required'],
            trim: true,
            unique: true,
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        nameBn: {
            type: String,
            trim: true,
            maxlength: [100, 'Bengali name cannot exceed 100 characters'],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        flag: { type: String },
        image: { type: String },
        region: { type: String },
        regionBn: { type: String },
        capital: { type: String },
        capitalBn: { type: String },
        currency: { type: String },
        timezone: { type: String },
        touristsPerYear: { type: String },

        // Visa Details
        description: {
            type: String,
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        descriptionBn: {
            type: String,
            maxlength: [2000, 'Bengali description cannot exceed 2000 characters'],
        },
        visaTypes: [visaTypeSchema],
        documentRequirements: [documentRequirementSchema],
        embassyInfo: embassyInfoSchema,

        // Pricing
        startingPrice: { type: Number },
        submissionType: {
            type: String,
            enum: ['e-visa', 'in-person', 'flexible'],
            default: 'in-person',
        },

        // SEO
        metaTitle: { type: String },
        metaDescription: { type: String },

        // Status & Order
        isActive: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// ==================== Indexes ====================
countrySchema.index({ slug: 1 });
countrySchema.index({ isActive: 1 });
countrySchema.index({ isFeatured: 1 });
countrySchema.index({ region: 1 });
countrySchema.index({ order: 1 });
countrySchema.index({ name: 'text', nameBn: 'text' });

// ==================== Static Methods ====================
countrySchema.statics.isCountryExists = async function (id: string): Promise<boolean> {
    const country = await this.findById(id);
    return !!country;
};

countrySchema.statics.findBySlug = async function (slug: string): Promise<ICountry | null> {
    return this.findOne({ slug });
};

// ==================== Export Model ====================
export const Country = model<ICountry, CountryModel>('Country', countrySchema);
