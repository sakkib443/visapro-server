// ===================================================================
// VisaPro - Hotel Service
// Business logic for Hotel module
// হোটেল মডিউলের বিজনেস লজিক
// ===================================================================

import { Hotel } from './hotel.model';
import { IHotel, IHotelFilters } from './hotel.interface';
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
 * Create a new hotel
 */
const createHotel = async (payload: Partial<IHotel>): Promise<IHotel> => {
    let slug = generateSlug(payload.name || '');

    // Ensure unique slug
    let existing = await Hotel.findOne({ slug });
    let counter = 1;
    while (existing) {
        slug = `${generateSlug(payload.name || '')}-${counter}`;
        existing = await Hotel.findOne({ slug });
        counter++;
    }

    const hotelData = { ...payload, slug };
    const hotel = await Hotel.create(hotelData);
    return hotel;
};

/**
 * Get all hotels with filters and pagination
 */
const getAllHotels = async (
    filters: IHotelFilters,
    paginationOptions: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }
) => {
    const { searchTerm, isActive, isFeatured, city, country, starRating, hotelCategory, roomType, status, minPrice, maxPrice } = filters;
    const { page = 1, limit = 200, sortBy = 'order', sortOrder = 'asc' } = paginationOptions;

    const conditions: any[] = [];

    if (searchTerm) {
        conditions.push({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { nameBn: { $regex: searchTerm, $options: 'i' } },
                { city: { $regex: searchTerm, $options: 'i' } },
                { location: { $regex: searchTerm, $options: 'i' } },
            ],
        });
    }

    if (isActive !== undefined) conditions.push({ isActive });
    if (isFeatured !== undefined) conditions.push({ isFeatured });
    if (city) conditions.push({ city: { $regex: city, $options: 'i' } });
    if (country) conditions.push({ country: { $regex: country, $options: 'i' } });
    if (starRating !== undefined) conditions.push({ starRating });
    if (hotelCategory) conditions.push({ hotelCategory });
    if (roomType) conditions.push({ roomType });
    if (status) conditions.push({ status });
    if (minPrice !== undefined) conditions.push({ pricePerNight: { $gte: minPrice } });
    if (maxPrice !== undefined) conditions.push({ pricePerNight: { $lte: maxPrice } });

    const whereCondition = conditions.length > 0 ? { $and: conditions } : {};
    const skip = (page - 1) * limit;
    const sortConfig: any = {};
    sortConfig[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const hotels = await Hotel.find(whereCondition)
        .sort(sortConfig)
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await Hotel.countDocuments(whereCondition);

    return {
        data: hotels,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/**
 * Get single hotel by ID
 */
const getHotelById = async (id: string): Promise<IHotel | null> => {
    const hotel = await Hotel.findById(id).lean();
    if (!hotel) throw new AppError(404, 'Hotel not found');
    return hotel;
};

/**
 * Get hotel by slug (public)
 */
const getHotelBySlug = async (slug: string): Promise<IHotel | null> => {
    const hotel = await Hotel.findOne({ slug, isActive: true }).lean();
    if (!hotel) throw new AppError(404, 'Hotel not found');
    return hotel;
};

/**
 * Update hotel
 */
const updateHotel = async (id: string, payload: Partial<IHotel>): Promise<IHotel | null> => {
    const hotel = await Hotel.findById(id);
    if (!hotel) throw new AppError(404, 'Hotel not found');

    // Update slug if name changed
    if (payload.name && payload.name !== hotel.name) {
        let newSlug = generateSlug(payload.name);
        const existing = await Hotel.findOne({ slug: newSlug, _id: { $ne: id } });
        if (existing) newSlug = `${newSlug}-${Date.now()}`;
        payload.slug = newSlug;
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    return updatedHotel;
};

/**
 * Delete hotel
 */
const deleteHotel = async (id: string): Promise<IHotel | null> => {
    const hotel = await Hotel.findById(id);
    if (!hotel) throw new AppError(404, 'Hotel not found');
    const deleted = await Hotel.findByIdAndDelete(id);
    return deleted;
};

/**
 * Get active hotels (public - for frontend listing)
 */
const getActiveHotels = async (): Promise<IHotel[]> => {
    const hotels = await Hotel.find({ isActive: true })
        .sort({ order: 1, createdAt: -1 })
        .lean();
    return hotels;
};

/**
 * Get featured hotels (for homepage)
 */
const getFeaturedHotels = async (): Promise<IHotel[]> => {
    const hotels = await Hotel.find({ isActive: true, isFeatured: true })
        .sort({ order: 1 })
        .lean();
    return hotels;
};

export const HotelService = {
    createHotel,
    getAllHotels,
    getHotelById,
    getHotelBySlug,
    updateHotel,
    deleteHotel,
    getActiveHotels,
    getFeaturedHotels,
};
