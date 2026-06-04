import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MessageService } from './message.service';

// POST /api/messages  → anyone can submit (public contact form)
const createMessage = catchAsync(async (req: Request, res: Response) => {
    const message = await MessageService.createMessage(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Message sent successfully',
        data: message,
    });
});

// GET /api/messages  → admin gets all (newest first)
const getAllMessages = catchAsync(async (_req: Request, res: Response) => {
    const messages = await MessageService.getAllMessages();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Messages retrieved',
        data: messages,
    });
});

// PATCH /api/messages/:id  → admin updates status
const updateStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const message = await MessageService.updateMessageStatus(id, status);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Message status updated',
        data: message,
    });
});

// DELETE /api/messages/:id  → admin deletes
const deleteMessage = catchAsync(async (req: Request, res: Response) => {
    await MessageService.deleteMessage(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Message deleted',
        data: null,
    });
});

export const MessageController = {
    createMessage,
    getAllMessages,
    updateStatus,
    deleteMessage,
};
