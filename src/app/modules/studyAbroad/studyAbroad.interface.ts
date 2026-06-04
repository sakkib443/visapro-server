import { Model } from 'mongoose';

export type TStudyAbroadStatus = 'open' | 'closed';

export interface IStudyAbroad {
    name: string;
    country: string;
    university: string;
    degree?: string;
    duration?: string;
    tuition: number;
    deadline?: string;
    requirements?: string;
    scholarship?: string;
    status: TStudyAbroadStatus;
    applications: number;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface StudyAbroadModel extends Model<IStudyAbroad> {}
