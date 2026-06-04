import express from 'express';
import { VisaApplicationController } from './visaApplication.controller';
import { VisaApplicationValidation } from './visaApplication.validation';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

// ── Admin only: all visa application CRM records (filter by ?status=&country=)
router.get('/', authMiddleware, authorizeRoles('admin'), VisaApplicationController.getAllVisaApplications);

// ── Admin only: single record
router.get('/:id', authMiddleware, authorizeRoles('admin'), VisaApplicationController.getVisaApplicationById);

// ── Admin only: create
router.post(
    '/',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(VisaApplicationValidation.createVisaApplicationSchema),
    VisaApplicationController.createVisaApplication
);

// ── Admin only: update (incl. status)
router.patch(
    '/:id',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(VisaApplicationValidation.updateVisaApplicationSchema),
    VisaApplicationController.updateVisaApplication
);

// ── Admin only: delete
router.delete('/:id', authMiddleware, authorizeRoles('admin'), VisaApplicationController.deleteVisaApplication);

export const VisaApplicationRoutes = router;
