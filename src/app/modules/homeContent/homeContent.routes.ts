// ===================================================================
// VisaPro - Home Content Routes
// ===================================================================

import express from 'express';
import { HomeContentController } from './homeContent.controller';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';

const router = express.Router();

// Public — homepage reads content
router.get('/', HomeContentController.getAllSections);
router.get('/:section', HomeContentController.getSection);

// Admin only — update section content
router.put(
    '/:section',
    authMiddleware,
    authorizeRoles('admin'),
    HomeContentController.updateSection
);

// Admin only — seed default data
router.post(
    '/seed',
    authMiddleware,
    authorizeRoles('admin'),
    HomeContentController.seedDefaults
);

export const HomeContentRoutes = router;
