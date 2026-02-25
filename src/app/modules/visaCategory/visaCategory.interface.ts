// ===================================================================
// VisaPro - Visa Category Interface
// Visa Category module TypeScript interface definitions
// ভিসা ক্যাটাগরি মডিউলের TypeScript interface definitions
// ===================================================================

import { Model, Types } from 'mongoose';

/**
 * IVisaCategory - Main Visa Category Interface
 * Database এ যে format এ visa category data save হবে
 */
export interface IVisaCategory {
    _id?: Types.ObjectId;

    // ==================== Basic Info ====================
    name: string;                     // Category name (English) e.g. "Tourist Visa"
    nameBn?: string;                  // Category name (Bengali) e.g. "পর্যটক ভিসা"
    slug: string;                     // URL friendly slug e.g. "tourist-visa"
    description?: string;             // Short description (English)
    descriptionBn?: string;           // Short description (Bengali)

    // ==================== Media ====================
    icon?: string;                    // Icon name or URL
    image?: string;                   // Category image URL

    // ==================== Status & Order ====================
    isActive: boolean;                // Whether this category is active
    order: number;                    // Display order (for sorting)

    // ==================== Timestamps ====================
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * IVisaCategoryFilters - Query Filters
 * Visa Category list filter করার জন্য
 */
export interface IVisaCategoryFilters {
    searchTerm?: string;
    isActive?: boolean;
}

/**
 * VisaCategoryModel - Mongoose Model Type
 */
export interface VisaCategoryModel extends Model<IVisaCategory> {
    isCategoryExists(id: string): Promise<boolean>;
    findBySlug(slug: string): Promise<IVisaCategory | null>;
}
