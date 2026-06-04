import { Schema, model } from 'mongoose';
import { IMessage, MessageModel } from './message.interface';

const messageSchema = new Schema<IMessage, MessageModel>(
    {
        from: {
            firstName: { type: String, required: true, trim: true },
            lastName: { type: String, trim: true },
            email: { type: String, required: true, trim: true, lowercase: true },
        },
        subject: { type: String, required: true, trim: true },
        message: { type: String, required: true, trim: true },

        status: {
            type: String,
            enum: ['unread', 'read', 'replied'],
            default: 'unread',
        },
    },
    { timestamps: true, versionKey: false }
);

messageSchema.index({ status: 1 });
messageSchema.index({ createdAt: -1 });

export const Message = model<IMessage, MessageModel>('Message', messageSchema);
