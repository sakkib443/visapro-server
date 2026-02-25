import express from 'express';
import { HajjUmrahController } from './hajjUmrah.controller';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';

const router = express.Router();

// Public routes
router.get('/active', HajjUmrahController.getActivePackages);
router.get('/featured', HajjUmrahController.getFeaturedPackages);
router.get('/type/:type', HajjUmrahController.getByType);
router.get('/slug/:slug', HajjUmrahController.getPackageBySlug);

// Admin routes
router.get('/', HajjUmrahController.getAllPackages);
router.get('/:id', HajjUmrahController.getPackageById);
router.post('/', authMiddleware, authorizeRoles('admin'), HajjUmrahController.createPackage);
router.patch('/:id', authMiddleware, authorizeRoles('admin'), HajjUmrahController.updatePackage);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), HajjUmrahController.deletePackage);

export const HajjUmrahRoutes = router;
