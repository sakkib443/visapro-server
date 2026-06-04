import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { VisaApplicationService } from './visaApplication.service';

// POST /api/visa-applications  → admin creates a CRM record
const createVisaApplication = catchAsync(async (req: Request, res: Response) => {
    const application = await VisaApplicationService.createVisaApplication(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Visa application created successfully',
        data: application,
    });
});

// GET /api/visa-applications  → admin gets all (newest first)
const getAllVisaApplications = catchAsync(async (req: Request, res: Response) => {
    const applications = await VisaApplicationService.getAllVisaApplications(
        req.query as Record<string, string>
    );
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Visa applications retrieved',
        data: applications,
    });
});

// GET /api/visa-applications/:id  → admin gets one
const getVisaApplicationById = catchAsync(async (req: Request, res: Response) => {
    const application = await VisaApplicationService.getVisaApplicationById(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Visa application retrieved',
        data: application,
    });
});

// PATCH /api/visa-applications/:id  → admin updates (incl. status)
const updateVisaApplication = catchAsync(async (req: Request, res: Response) => {
    const application = await VisaApplicationService.updateVisaApplication(
        req.params.id,
        req.body
    );
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Visa application updated',
        data: application,
    });
});

// DELETE /api/visa-applications/:id  → admin deletes
const deleteVisaApplication = catchAsync(async (req: Request, res: Response) => {
    await VisaApplicationService.deleteVisaApplication(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Visa application deleted',
        data: null,
    });
});

export const VisaApplicationController = {
    createVisaApplication,
    getAllVisaApplications,
    getVisaApplicationById,
    updateVisaApplication,
    deleteVisaApplication,
};
