// ===================================================================
// VisaPro - Visa Category Controller
// HTTP request handlers for Visa Category module
// ভিসা ক্যাটাগরি মডিউলের HTTP রিকোয়েস্ট হ্যান্ডলার
// ===================================================================

import { Request, Response, NextFunction } from 'express';
import { VisaCategoryService } from './visaCategory.service';
import { IVisaCategoryFilters } from './visaCategory.interface';

/**
 * Create a new visa category
 * POST /api/visa-categories
 */
const createVisaCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await VisaCategoryService.createVisaCategory(req.body);

        res.status(201).json({
            success: true,
            message: 'Visa category created successfully',
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all visa categories with filters
 * GET /api/visa-categories
 */
const getAllVisaCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { searchTerm, isActive, page, limit, sortBy, sortOrder } = req.query;

        const filters: IVisaCategoryFilters = {};
        if (searchTerm) filters.searchTerm = searchTerm as string;
        if (isActive === 'true') filters.isActive = true;
        if (isActive === 'false') filters.isActive = false;

        const paginationOptions = {
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 50,
            sortBy: (sortBy as string) || 'order',
            sortOrder: (sortOrder as 'asc' | 'desc') || 'asc',
        };

        const result = await VisaCategoryService.getAllVisaCategories(filters, paginationOptions);

        res.status(200).json({
            success: true,
            message: 'Visa categories retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get single visa category by ID
 * GET /api/visa-categories/:id
 */
const getVisaCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const category = await VisaCategoryService.getVisaCategoryById(id);

        res.status(200).json({
            success: true,
            message: 'Visa category retrieved successfully',
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get visa category by slug
 * GET /api/visa-categories/slug/:slug
 */
const getVisaCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { slug } = req.params;
        const category = await VisaCategoryService.getVisaCategoryBySlug(slug);

        res.status(200).json({
            success: true,
            message: 'Visa category retrieved successfully',
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update visa category
 * PATCH /api/visa-categories/:id
 */
const updateVisaCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const category = await VisaCategoryService.updateVisaCategory(id, req.body);

        res.status(200).json({
            success: true,
            message: 'Visa category updated successfully',
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete visa category
 * DELETE /api/visa-categories/:id
 */
const deleteVisaCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await VisaCategoryService.deleteVisaCategory(id);

        res.status(200).json({
            success: true,
            message: 'Visa category deleted successfully',
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get active visa categories (public)
 * GET /api/visa-categories/active
 */
const getActiveVisaCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await VisaCategoryService.getActiveVisaCategories();

        res.status(200).json({
            success: true,
            message: 'Active visa categories retrieved successfully',
            data: categories,
        });
    } catch (error) {
        next(error);
    }
};

export const VisaCategoryController = {
    createVisaCategory,
    getAllVisaCategories,
    getVisaCategoryById,
    getVisaCategoryBySlug,
    updateVisaCategory,
    deleteVisaCategory,
    getActiveVisaCategories,
};
