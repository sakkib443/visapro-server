import { Model } from 'mongoose';

export type TMessageStatus = 'unread' | 'read' | 'replied';

export interface IMessageFrom {
    firstName: string;
    lastName?: string;
    email: string;
}

export interface IMessage {
    from: IMessageFrom;
    subject: string;
    message: string;
    status: TMessageStatus;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface MessageModel extends Model<IMessage> {}
