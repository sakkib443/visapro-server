// ===================================================================
// VisaPro - Visa Category Model
// Mongoose schema for Visa Category module
// ভিসা ক্যাটাগরি মডিউলের Mongoose স্কিমা
// ===================================================================

import { Schema, model } from 'mongoose';
import { IVisaCategory, VisaCategoryModel } from './visaCategory.interface';

// ==================== Visa Category Schema ====================
const visaCategorySchema = new Schema<IVisaCategory, VisaCategoryModel>(
    {
        // Basic Info
        name: {
            type: String,
            required: [true, 'Category name is required'],
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
        description: {
            type: String,
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },
        descriptionBn: {
            type: String,
            maxlength: [500, 'Bengali description cannot exceed 500 characters'],
        },

        // Media
        icon: {
            type: String,
        },
        image: {
            type: String,
        },

        // Status & Order
        isActive: {
            type: Boolean,
            default: true,
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
visaCategorySchema.index({ slug: 1 });
visaCategorySchema.index({ isActive: 1 });
visaCategorySchema.index({ order: 1 });
visaCategorySchema.index({ name: 'text' });

// ==================== Static Methods ====================
visaCategorySchema.statics.isCategoryExists = async function (id: string): Promise<boolean> {
    const category = await this.findById(id);
    return !!category;
};

visaCategorySchema.statics.findBySlug = async function (slug: string): Promise<IVisaCategory | null> {
    return this.findOne({ slug });
};

// ==================== Export Model ====================
export const VisaCategory = model<IVisaCategory, VisaCategoryModel>('VisaCategory', visaCategorySchema);
