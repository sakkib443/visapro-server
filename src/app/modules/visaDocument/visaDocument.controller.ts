// ===================================================================
// VisaPro - Visa Document Controller
// ভিসা ডকুমেন্ট মডিউলের HTTP রিকোয়েস্ট হ্যান্ডলার
// ===================================================================

import { Request, Response, NextFunction } from 'express';
import { VisaDocumentService } from './visaDocument.service';
import { IVisaDocumentFilters } from './visaDocument.interface';

/**
 * Create a new visa document (admin only)
 * POST /api/visa-documents
 */
const createVisaDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminId = (req as any).user?.userId;
        const doc = await VisaDocumentService.createVisaDocument(req.body, adminId);
        res.status(201).json({
            success: true,
            message: 'Visa document created successfully',
            data: doc,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all visa documents (admin only)
 * GET /api/visa-documents
 */
const getAllVisaDocuments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { searchTerm, user, status, country, visaType, page, limit, sortBy, sortOrder } = req.query;

        const filters: IVisaDocumentFilters = {};
        if (searchTerm) filters.searchTerm = searchTerm as string;
        if (user) filters.user = user as string;
        if (status) filters.status = status as string;
        if (country) filters.country = country as string;
        if (visaType) filters.visaType = visaType as string;

        const paginationOptions = {
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 50,
            sortBy: (sortBy as string) || 'createdAt',
            sortOrder: (sortOrder as 'asc' | 'desc') || 'desc',
        };

        const result = await VisaDocumentService.getAllVisaDocuments(filters, paginationOptions);

        res.status(200).json({
            success: true,
            message: 'Visa documents retrieved successfully',
            data: result.data,
            meta: result.meta,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get my visa documents (logged-in user)
 * GET /api/visa-documents/my
 */
const getMyVisaDocuments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.userId;
        const docs = await VisaDocumentService.getMyVisaDocuments(userId);
        res.status(200).json({
            success: true,
            message: 'Your visa documents retrieved successfully',
            data: docs,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get single visa document by ID
 * GET /api/visa-documents/:id
 */
const getVisaDocumentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const doc = await VisaDocumentService.getVisaDocumentById(id);
        res.status(200).json({
            success: true,
            message: 'Visa document retrieved successfully',
            data: doc,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update visa document (admin only)
 * PATCH /api/visa-documents/:id
 */
const updateVisaDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const doc = await VisaDocumentService.updateVisaDocument(id, req.body);
        res.status(200).json({
            success: true,
            message: 'Visa document updated successfully',
            data: doc,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete visa document (admin only)
 * DELETE /api/visa-documents/:id
 */
const deleteVisaDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await VisaDocumentService.deleteVisaDocument(id);
        res.status(200).json({
            success: true,
            message: 'Visa document deleted successfully',
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

export const VisaDocumentController = {
    createVisaDocument,
    getAllVisaDocuments,
    getMyVisaDocuments,
    getVisaDocumentById,
    updateVisaDocument,
    deleteVisaDocument,
};
