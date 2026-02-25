// ===================================================================
// VisaPro - Country Controller
// HTTP request handlers for Country module
// দেশ মডিউলের HTTP রিকোয়েস্ট হ্যান্ডলার
// ===================================================================

import { Request, Response, NextFunction } from 'express';
import { CountryService } from './country.service';
import { ICountryFilters } from './country.interface';

/**
 * Create a new country
 * POST /api/countries
 */
const createCountry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const country = await CountryService.createCountry(req.body);
        res.status(201).json({
            success: true,
            message: 'Country created successfully',
            data: country,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all countries with filters
 * GET /api/countries
 */
const getAllCountries = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { searchTerm, isActive, isFeatured, region, submissionType, page, limit, sortBy, sortOrder } = req.query;

        const filters: ICountryFilters = {};
        if (searchTerm) filters.searchTerm = searchTerm as string;
        if (isActive === 'true') filters.isActive = true;
        if (isActive === 'false') filters.isActive = false;
        if (isFeatured === 'true') filters.isFeatured = true;
        if (region) filters.region = region as string;
        if (submissionType) filters.submissionType = submissionType as string;

        const paginationOptions = {
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 200,
            sortBy: (sortBy as string) || 'name',
            sortOrder: (sortOrder as 'asc' | 'desc') || 'asc',
        };

        const result = await CountryService.getAllCountries(filters, paginationOptions);

        res.status(200).json({
            success: true,
            message: 'Countries retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get single country by ID
 * GET /api/countries/:id
 */
const getCountryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const country = await CountryService.getCountryById(id);
        res.status(200).json({
            success: true,
            message: 'Country retrieved successfully',
            data: country,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get country by slug (public)
 * GET /api/countries/slug/:slug
 */
const getCountryBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { slug } = req.params;
        const country = await CountryService.getCountryBySlug(slug);
        res.status(200).json({
            success: true,
            message: 'Country retrieved successfully',
            data: country,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update country
 * PATCH /api/countries/:id
 */
const updateCountry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const country = await CountryService.updateCountry(id, req.body);
        res.status(200).json({
            success: true,
            message: 'Country updated successfully',
            data: country,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete country
 * DELETE /api/countries/:id
 */
const deleteCountry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await CountryService.deleteCountry(id);
        res.status(200).json({
            success: true,
            message: 'Country deleted successfully',
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get active countries (public - for dropdowns)
 * GET /api/countries/active
 */
const getActiveCountries = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const countries = await CountryService.getActiveCountries();
        res.status(200).json({
            success: true,
            message: 'Active countries retrieved successfully',
            data: countries,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get featured countries (public - for homepage)
 * GET /api/countries/featured
 */
const getFeaturedCountries = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const countries = await CountryService.getFeaturedCountries();
        res.status(200).json({
            success: true,
            message: 'Featured countries retrieved successfully',
            data: countries,
        });
    } catch (error) {
        next(error);
    }
};

export const CountryController = {
    createCountry,
    getAllCountries,
    getCountryById,
    getCountryBySlug,
    updateCountry,
    deleteCountry,
    getActiveCountries,
    getFeaturedCountries,
};
