// ===================================================================
// VisaPro - Visa Category Routes
// Visa Category module এর API endpoints
// ভিসা ক্যাটাগরি মডিউলের API রাউটস
// ===================================================================

import express from 'express';
import { VisaCategoryController } from './visaCategory.controller';
import { VisaCategoryValidation } from './visaCategory.validation';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

// ==================== Public Routes ====================

// Get active visa categories (for frontend dropdown, etc.)
router.get(
    '/active',
    VisaCategoryController.getActiveVisaCategories
);

// Get all visa categories (public list)
router.get(
    '/',
    VisaCategoryController.getAllVisaCategories
);

// Get visa category by slug
router.get(
    '/slug/:slug',
    VisaCategoryController.getVisaCategoryBySlug
);

// Get single visa category by ID
router.get(
    '/:id',
    VisaCategoryController.getVisaCategoryById
);

// ==================== Admin Routes ====================

// Create new visa category
router.post(
    '/',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(VisaCategoryValidation.createVisaCategorySchema),
    VisaCategoryController.createVisaCategory
);

// Update visa category
router.patch(
    '/:id',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(VisaCategoryValidation.updateVisaCategorySchema),
    VisaCategoryController.updateVisaCategory
);

// Delete visa category
router.delete(
    '/:id',
    authMiddleware,
    authorizeRoles('admin'),
    VisaCategoryController.deleteVisaCategory
);

export const VisaCategoryRoutes = router;
