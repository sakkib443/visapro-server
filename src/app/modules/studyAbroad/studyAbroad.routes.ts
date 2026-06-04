import express from 'express';
import { StudyAbroadController } from './studyAbroad.controller';
import { StudyAbroadValidation } from './studyAbroad.validation';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

// ── Public: list all programs (newest first)
router.get('/', StudyAbroadController.getAllStudyAbroad);

// ── Public: single program
router.get('/:id', StudyAbroadController.getSingleStudyAbroad);

// ── Admin: create program
router.post(
    '/',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(StudyAbroadValidation.createStudyAbroadSchema),
    StudyAbroadController.createStudyAbroad
);

// ── Admin: update program
router.patch(
    '/:id',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(StudyAbroadValidation.updateStudyAbroadSchema),
    StudyAbroadController.updateStudyAbroad
);

// ── Admin: delete program
router.delete(
    '/:id',
    authMiddleware,
    authorizeRoles('admin'),
    StudyAbroadController.deleteStudyAbroad
);

export const StudyAbroadRoutes = router;
