// ===================================================================
// VisaPro - Visa Category Service
// Business logic for Visa Category module
// ভিসা ক্যাটাগরি মডিউলের বিজনেস লজিক
// ===================================================================

import { VisaCategory } from './visaCategory.model';
import { IVisaCategory, IVisaCategoryFilters } from './visaCategory.interface';
import AppError from '../../utils/AppError';

/**
 * Generate URL-friendly slug from name
 */
const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};

/**
 * Create a new visa category
 * নতুন ভিসা ক্যাটাগরি তৈরি করা
 */
const createVisaCategory = async (payload: Partial<IVisaCategory>): Promise<IVisaCategory> => {
    // Generate slug from name
    let slug = generateSlug(payload.name || '');

    // Check if slug already exists
    let existingCategory = await VisaCategory.findOne({ slug });
    let counter = 1;
    while (existingCategory) {
        slug = `${generateSlug(payload.name || '')}-${counter}`;
        existingCategory = await VisaCategory.findOne({ slug });
        counter++;
    }

    const categoryData = {
        ...payload,
        slug,
    };

    const category = await VisaCategory.create(categoryData);
    return category;
};

/**
 * Get all visa categories with filters and pagination
 * ফিল্টার ও পেজিনেশন সহ সব ভিসা ক্যাটাগরি পাওয়া
 */
const getAllVisaCategories = async (
    filters: IVisaCategoryFilters,
    paginationOptions: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }
) => {
    const { searchTerm, isActive } = filters;
    const { page = 1, limit = 50, sortBy = 'order', sortOrder = 'asc' } = paginationOptions;

    // Build query conditions
    const conditions: any[] = [];

    if (searchTerm) {
        conditions.push({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { nameBn: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
            ],
        });
    }

    if (isActive !== undefined) {
        conditions.push({ isActive });
    }

    const whereCondition = conditions.length > 0 ? { $and: conditions } : {};
    const skip = (page - 1) * limit;
    const sortConfig: any = {};
    sortConfig[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const categories = await VisaCategory.find(whereCondition)
        .sort(sortConfig)
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await VisaCategory.countDocuments(whereCondition);

    return {
        data: categories,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/**
 * Get single visa category by ID
 * ID দিয়ে একটি ভিসা ক্যাটাগরি পাওয়া
 */
const getVisaCategoryById = async (id: string): Promise<IVisaCategory | null> => {
    const category = await VisaCategory.findById(id).lean();

    if (!category) {
        throw new AppError(404, 'Visa category not found');
    }

    return category;
};

/**
 * Get visa category by slug
 * Slug দিয়ে ভিসা ক্যাটাগরি পাওয়া
 */
const getVisaCategoryBySlug = async (slug: string): Promise<IVisaCategory | null> => {
    const category = await VisaCategory.findOne({ slug, isActive: true }).lean();

    if (!category) {
        throw new AppError(404, 'Visa category not found');
    }

    return category;
};

/**
 * Update visa category
 * ভিসা ক্যাটাগরি আপডেট করা
 */
const updateVisaCategory = async (
    id: string,
    payload: Partial<IVisaCategory>
): Promise<IVisaCategory | null> => {
    const category = await VisaCategory.findById(id);

    if (!category) {
        throw new AppError(404, 'Visa category not found');
    }

    // If name is being updated, update slug too
    if (payload.name && payload.name !== category.name) {
        let newSlug = generateSlug(payload.name);
        const existingCategory = await VisaCategory.findOne({ slug: newSlug, _id: { $ne: id } });
        if (existingCategory) {
            newSlug = `${newSlug}-${Date.now()}`;
        }
        payload.slug = newSlug;
    }

    const updatedCategory = await VisaCategory.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    return updatedCategory;
};

/**
 * Delete visa category
 * ভিসা ক্যাটাগরি ডিলিট করা
 */
const deleteVisaCategory = async (id: string): Promise<IVisaCategory | null> => {
    const category = await VisaCategory.findById(id);

    if (!category) {
        throw new AppError(404, 'Visa category not found');
    }

    const deletedCategory = await VisaCategory.findByIdAndDelete(id);
    return deletedCategory;
};

/**
 * Get active visa categories (for public/frontend)
 * এক্টিভ ভিসা ক্যাটাগরিগুলো পাওয়া
 */
const getActiveVisaCategories = async (): Promise<IVisaCategory[]> => {
    const categories = await VisaCategory.find({ isActive: true })
        .sort({ order: 1 })
        .lean();

    return categories;
};

export const VisaCategoryService = {
    createVisaCategory,
    getAllVisaCategories,
    getVisaCategoryById,
    getVisaCategoryBySlug,
    updateVisaCategory,
    deleteVisaCategory,
    getActiveVisaCategories,
};
