import { Model } from 'mongoose';

export type TVisaApplicationStatus = 'pending' | 'processing' | 'approved' | 'rejected';

export interface IVisaApplication {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    passportNo?: string;

    visaType: string;
    country: string;
    fee: number;
    notes?: string;

    status: TVisaApplicationStatus;

    applicationId: string;
    appliedDate?: string;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface VisaApplicationModel extends Model<IVisaApplication> {}
