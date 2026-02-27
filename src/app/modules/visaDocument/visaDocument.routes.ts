// ===================================================================
// VisaPro - Visa Document Routes
// ভিসা ডকুমেন্ট মডিউলের API রাউটস
// ===================================================================

import express from 'express';
import { VisaDocumentController } from './visaDocument.controller';
import { VisaDocumentValidation } from './visaDocument.validation';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

// ==================== User Routes (authenticated) ====================

// Get my visa documents (logged-in user only)
router.get(
    '/my',
    authMiddleware,
    VisaDocumentController.getMyVisaDocuments
);

// ==================== Admin Routes ====================

// Get all visa documents
router.get(
    '/',
    authMiddleware,
    authorizeRoles('admin'),
    VisaDocumentController.getAllVisaDocuments
);

// Get single visa document by ID
router.get(
    '/:id',
    authMiddleware,
    VisaDocumentController.getVisaDocumentById
);

// Create new visa document
router.post(
    '/',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(VisaDocumentValidation.createVisaDocumentSchema),
    VisaDocumentController.createVisaDocument
);

// Update visa document
router.patch(
    '/:id',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(VisaDocumentValidation.updateVisaDocumentSchema),
    VisaDocumentController.updateVisaDocument
);

// Delete visa document
router.delete(
    '/:id',
    authMiddleware,
    authorizeRoles('admin'),
    VisaDocumentController.deleteVisaDocument
);

export const VisaDocumentRoutes = router;
