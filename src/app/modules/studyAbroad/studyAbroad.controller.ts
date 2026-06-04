import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StudyAbroadService } from './studyAbroad.service';

// GET /api/study-abroad  → public, list all programs (newest first)
const getAllStudyAbroad = catchAsync(async (_req: Request, res: Response) => {
    const programs = await StudyAbroadService.getAllStudyAbroad();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Study abroad programs retrieved',
        data: programs,
    });
});

// GET /api/study-abroad/:id  → public, single program
const getSingleStudyAbroad = catchAsync(async (req: Request, res: Response) => {
    const program = await StudyAbroadService.getSingleStudyAbroad(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Study abroad program retrieved',
        data: program,
    });
});

// POST /api/study-abroad  → admin creates a program
const createStudyAbroad = catchAsync(async (req: Request, res: Response) => {
    const program = await StudyAbroadService.createStudyAbroad(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Study abroad program created',
        data: program,
    });
});

// PATCH /api/study-abroad/:id  → admin updates a program
const updateStudyAbroad = catchAsync(async (req: Request, res: Response) => {
    const program = await StudyAbroadService.updateStudyAbroad(
        req.params.id,
        req.body
    );
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Study abroad program updated',
        data: program,
    });
});

// DELETE /api/study-abroad/:id  → admin deletes a program
const deleteStudyAbroad = catchAsync(async (req: Request, res: Response) => {
    await StudyAbroadService.deleteStudyAbroad(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Study abroad program deleted',
        data: null,
    });
});

export const StudyAbroadController = {
    getAllStudyAbroad,
    getSingleStudyAbroad,
    createStudyAbroad,
    updateStudyAbroad,
    deleteStudyAbroad,
};
