import { Message } from './message.model';
import AppError from '../../utils/AppError';

// Create a new message (public contact form / visitor)
const createMessage = async (payload: Record<string, unknown>) => {
    // Whitelist: only the public contact fields are accepted.
    // status is NOT settable from the request body.
    const data = {
        from: {
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
        },
        subject: payload.subject,
        message: payload.message,
    };
    const message = await Message.create(data);
    return message;
};

// Get all messages (admin) - newest first
const getAllMessages = async () => {
    const messages = await Message.find().sort({ createdAt: -1 });
    return messages;
};

// Update message status (admin)
const updateMessageStatus = async (id: string, status: string) => {
    const message = await Message.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    );
    if (!message) throw new AppError(404, 'Message not found');
    return message;
};

// Delete message (admin)
const deleteMessage = async (id: string) => {
    const message = await Message.findByIdAndDelete(id);
    if (!message) throw new AppError(404, 'Message not found');
    return message;
};

export const MessageService = {
    createMessage,
    getAllMessages,
    updateMessageStatus,
    deleteMessage,
};
