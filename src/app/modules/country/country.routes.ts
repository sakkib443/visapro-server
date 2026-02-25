// ===================================================================
// VisaPro - Country Routes
// Country module এর API endpoints
// দেশ মডিউলের API রাউটস
// ===================================================================

import express from 'express';
import { CountryController } from './country.controller';
import { CountryValidation } from './country.validation';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

// ==================== Public Routes ====================

// Get active countries (for frontend dropdowns)
router.get(
    '/active',
    CountryController.getActiveCountries
);

// Get featured countries (for homepage)
router.get(
    '/featured',
    CountryController.getFeaturedCountries
);

// Get country by slug (public detail page)
router.get(
    '/slug/:slug',
    CountryController.getCountryBySlug
);

// Get all countries (public list)
router.get(
    '/',
    CountryController.getAllCountries
);

// Get single country by ID
router.get(
    '/:id',
    CountryController.getCountryById
);

// ==================== Admin Routes ====================

// Create new country
router.post(
    '/',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(CountryValidation.createCountrySchema),
    CountryController.createCountry
);

// Update country
router.patch(
    '/:id',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(CountryValidation.updateCountrySchema),
    CountryController.updateCountry
);

// Delete country
router.delete(
    '/:id',
    authMiddleware,
    authorizeRoles('admin'),
    CountryController.deleteCountry
);

export const CountryRoutes = router;
