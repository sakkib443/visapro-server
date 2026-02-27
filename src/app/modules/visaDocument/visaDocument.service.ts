// ===================================================================
// VisaPro - Visa Document Service
// ভিসা ডকুমেন্ট মডিউলের বিজনেস লজিক
// ===================================================================

import { Types } from 'mongoose';
import { VisaDocument } from './visaDocument.model';
import { IVisaDocument, IVisaDocumentFilters } from './visaDocument.interface';
import AppError from '../../utils/AppError';

/**
 * Create a new visa document (admin only)
 */
const createVisaDocument = async (payload: Partial<IVisaDocument>, adminId: string): Promise<IVisaDocument> => {
    const data = {
        ...payload,
        createdBy: new Types.ObjectId(adminId),
    };
    const doc = await VisaDocument.create(data);
    return doc.populate([
        { path: 'user', select: 'firstName lastName email phone' },
        { path: 'createdBy', select: 'firstName lastName email' },
    ]);
};

/**
 * Get all visa documents (admin only) with filters and pagination
 */
const getAllVisaDocuments = async (
    filters: IVisaDocumentFilters,
    paginationOptions: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }
) => {
    const { searchTerm, user, status, country, visaType } = filters;
    const { page = 1, limit = 50, sortBy = 'createdAt', sortOrder = 'desc' } = paginationOptions;

    const conditions: any[] = [];

    if (searchTerm) {
        conditions.push({
            $or: [
                { applicantName: { $regex: searchTerm, $options: 'i' } },
                { applicantNameBn: { $regex: searchTerm, $options: 'i' } },
                { passportNo: { $regex: searchTerm, $options: 'i' } },
                { visaNo: { $regex: searchTerm, $options: 'i' } },
                { country: { $regex: searchTerm, $options: 'i' } },
            ],
        });
    }

    if (user) conditions.push({ user: new Types.ObjectId(user) });
    if (status) conditions.push({ status });
    if (country) conditions.push({ country: { $regex: country, $options: 'i' } });
    if (visaType) conditions.push({ visaType });

    const whereCondition = conditions.length > 0 ? { $and: conditions } : {};
    const skip = (page - 1) * limit;
    const sortConfig: any = {};
    sortConfig[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const docs = await VisaDocument.find(whereCondition)
        .populate({ path: 'user', select: 'firstName lastName email phone' })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .sort(sortConfig)
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await VisaDocument.countDocuments(whereCondition);

    return {
        data: docs,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/**
 * Get visa documents for the logged-in user
 */
const getMyVisaDocuments = async (userId: string): Promise<IVisaDocument[]> => {
    const docs = await VisaDocument.find({ user: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .lean();
    return docs;
};

/**
 * Get single visa document by ID
 */
const getVisaDocumentById = async (id: string): Promise<IVisaDocument | null> => {
    const doc = await VisaDocument.findById(id)
        .populate({ path: 'user', select: 'firstName lastName email phone' })
        .populate({ path: 'createdBy', select: 'firstName lastName email' })
        .lean();
    if (!doc) throw new AppError(404, 'Visa document not found');
    return doc;
};

/**
 * Update visa document (admin only)
 */
const updateVisaDocument = async (id: string, payload: Partial<IVisaDocument>): Promise<IVisaDocument | null> => {
    const doc = await VisaDocument.findById(id);
    if (!doc) throw new AppError(404, 'Visa document not found');

    const updated = await VisaDocument.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    })
        .populate({ path: 'user', select: 'firstName lastName email phone' })
        .populate({ path: 'createdBy', select: 'firstName lastName email' });

    return updated;
};

/**
 * Delete visa document (admin only)
 */
const deleteVisaDocument = async (id: string): Promise<IVisaDocument | null> => {
    const doc = await VisaDocument.findById(id);
    if (!doc) throw new AppError(404, 'Visa document not found');
    const deleted = await VisaDocument.findByIdAndDelete(id);
    return deleted;
};

export const VisaDocumentService = {
    createVisaDocument,
    getAllVisaDocuments,
    getMyVisaDocuments,
    getVisaDocumentById,
    updateVisaDocument,
    deleteVisaDocument,
};
