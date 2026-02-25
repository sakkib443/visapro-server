// ===================================================================
// VisaPro - Country Service
// Business logic for Country module
// দেশ মডিউলের বিজনেস লজিক
// ===================================================================

import { Country } from './country.model';
import { ICountry, ICountryFilters } from './country.interface';
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
 * Create a new country
 * নতুন দেশ তৈরি করা
 */
const createCountry = async (payload: Partial<ICountry>): Promise<ICountry> => {
    let slug = generateSlug(payload.name || '');

    let existing = await Country.findOne({ slug });
    let counter = 1;
    while (existing) {
        slug = `${generateSlug(payload.name || '')}-${counter}`;
        existing = await Country.findOne({ slug });
        counter++;
    }

    const countryData = { ...payload, slug };
    const country = await Country.create(countryData);
    return country;
};

/**
 * Get all countries with filters and pagination
 */
const getAllCountries = async (
    filters: ICountryFilters,
    paginationOptions: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }
) => {
    const { searchTerm, isActive, isFeatured, region, submissionType } = filters;
    const { page = 1, limit = 200, sortBy = 'name', sortOrder = 'asc' } = paginationOptions;

    const conditions: any[] = [];

    if (searchTerm) {
        conditions.push({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { nameBn: { $regex: searchTerm, $options: 'i' } },
                { region: { $regex: searchTerm, $options: 'i' } },
            ],
        });
    }

    if (isActive !== undefined) conditions.push({ isActive });
    if (isFeatured !== undefined) conditions.push({ isFeatured });
    if (region) conditions.push({ region });
    if (submissionType) conditions.push({ submissionType });

    const whereCondition = conditions.length > 0 ? { $and: conditions } : {};
    const skip = (page - 1) * limit;
    const sortConfig: any = {};
    sortConfig[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const countries = await Country.find(whereCondition)
        .sort(sortConfig)
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await Country.countDocuments(whereCondition);

    return {
        data: countries,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/**
 * Get single country by ID
 */
const getCountryById = async (id: string): Promise<ICountry | null> => {
    const country = await Country.findById(id).lean();
    if (!country) throw new AppError(404, 'Country not found');
    return country;
};

/**
 * Get country by slug (public)
 */
const getCountryBySlug = async (slug: string): Promise<ICountry | null> => {
    const country = await Country.findOne({ slug, isActive: true }).lean();
    if (!country) throw new AppError(404, 'Country not found');
    return country;
};

/**
 * Update country
 */
const updateCountry = async (
    id: string,
    payload: Partial<ICountry>
): Promise<ICountry | null> => {
    const country = await Country.findById(id);
    if (!country) throw new AppError(404, 'Country not found');

    if (payload.name && payload.name !== country.name) {
        let newSlug = generateSlug(payload.name);
        const existing = await Country.findOne({ slug: newSlug, _id: { $ne: id } });
        if (existing) newSlug = `${newSlug}-${Date.now()}`;
        payload.slug = newSlug;
    }

    const updatedCountry = await Country.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    return updatedCountry;
};

/**
 * Delete country
 */
const deleteCountry = async (id: string): Promise<ICountry | null> => {
    const country = await Country.findById(id);
    if (!country) throw new AppError(404, 'Country not found');
    const deleted = await Country.findByIdAndDelete(id);
    return deleted;
};

/**
 * Get active countries (public - for dropdowns/lists)
 */
const getActiveCountries = async (): Promise<ICountry[]> => {
    const countries = await Country.find({ isActive: true })
        .select('name nameBn slug flag region regionBn startingPrice submissionType isFeatured image')
        .sort({ name: 1 })
        .lean();
    return countries;
};

/**
 * Get featured countries (for homepage)
 */
const getFeaturedCountries = async (): Promise<ICountry[]> => {
    const countries = await Country.find({ isActive: true, isFeatured: true })
        .sort({ order: 1 })
        .lean();
    return countries;
};

export const CountryService = {
    createCountry,
    getAllCountries,
    getCountryById,
    getCountryBySlug,
    updateCountry,
    deleteCountry,
    getActiveCountries,
    getFeaturedCountries,
};
