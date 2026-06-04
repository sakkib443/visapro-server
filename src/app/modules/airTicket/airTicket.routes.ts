import express from 'express';
import { AirTicketController } from './airTicket.controller';
import { AirTicketValidation } from './airTicket.validation';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

// ── Admin: all air tickets (filter by ?status=pending)
router.get('/', authMiddleware, authorizeRoles('admin'), AirTicketController.getAllAirTickets);

// ── Admin: single air ticket
router.get('/:id', authMiddleware, authorizeRoles('admin'), AirTicketController.getAirTicketById);

// ── Admin: create air ticket
router.post(
    '/',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(AirTicketValidation.createAirTicketSchema),
    AirTicketController.createAirTicket
);

// ── Admin: update air ticket (incl. status)
router.patch(
    '/:id',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(AirTicketValidation.updateAirTicketSchema),
    AirTicketController.updateAirTicket
);

// ── Admin: delete
router.delete('/:id', authMiddleware, authorizeRoles('admin'), AirTicketController.deleteAirTicket);

export const AirTicketRoutes = router;
