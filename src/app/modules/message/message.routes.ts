import express from 'express';
import { MessageController } from './message.controller';
import { MessageValidation } from './message.validation';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

// ── Public: anyone (visitor / contact form) can send a message
router.post(
    '/',
    validateRequest(MessageValidation.createMessageSchema),
    MessageController.createMessage
);

// ── Admin: all messages (newest first)
router.get('/', authMiddleware, authorizeRoles('admin'), MessageController.getAllMessages);

// ── Admin: update status
router.patch(
    '/:id',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(MessageValidation.updateMessageStatusSchema),
    MessageController.updateStatus
);

// ── Admin: delete
router.delete('/:id', authMiddleware, authorizeRoles('admin'), MessageController.deleteMessage);

export const MessageRoutes = router;
