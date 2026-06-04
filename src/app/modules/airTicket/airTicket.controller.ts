import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AirTicketService } from './airTicket.service';

// POST /api/air-tickets  → admin creates booking
const createAirTicket = catchAsync(async (req: Request, res: Response) => {
    const airTicket = await AirTicketService.createAirTicket(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Air ticket created successfully',
        data: airTicket,
    });
});

// GET /api/air-tickets  → admin gets all
const getAllAirTickets = catchAsync(async (req: Request, res: Response) => {
    const airTickets = await AirTicketService.getAllAirTickets(
        req.query as Record<string, string>
    );
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Air tickets retrieved',
        data: airTickets,
    });
});

// GET /api/air-tickets/:id  → admin gets one
const getAirTicketById = catchAsync(async (req: Request, res: Response) => {
    const airTicket = await AirTicketService.getAirTicketById(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Air ticket retrieved',
        data: airTicket,
    });
});

// PATCH /api/air-tickets/:id  → admin updates (incl. status)
const updateAirTicket = catchAsync(async (req: Request, res: Response) => {
    const airTicket = await AirTicketService.updateAirTicket(req.params.id, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Air ticket updated',
        data: airTicket,
    });
});

// DELETE /api/air-tickets/:id  → admin deletes
const deleteAirTicket = catchAsync(async (req: Request, res: Response) => {
    await AirTicketService.deleteAirTicket(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Air ticket deleted',
        data: null,
    });
});

export const AirTicketController = {
    createAirTicket,
    getAllAirTickets,
    getAirTicketById,
    updateAirTicket,
    deleteAirTicket,
};
