import { Schema, model } from 'mongoose';
import { IStudyAbroad, StudyAbroadModel } from './studyAbroad.interface';

const studyAbroadSchema = new Schema<IStudyAbroad, StudyAbroadModel>(
    {
        name: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
        university: { type: String, required: true, trim: true },
        degree: { type: String, trim: true },
        duration: { type: String, trim: true },
        tuition: { type: Number, default: 0 },
        deadline: { type: String, trim: true },
        requirements: { type: String, trim: true },
        scholarship: { type: String, trim: true },
        status: {
            type: String,
            enum: ['open', 'closed'],
            default: 'open',
        },
        applications: { type: Number, default: 0 },
    },
    { timestamps: true, versionKey: false }
);

studyAbroadSchema.index({ country: 1 });
studyAbroadSchema.index({ status: 1 });
studyAbroadSchema.index({ createdAt: -1 });

export const StudyAbroad = model<IStudyAbroad, StudyAbroadModel>(
    'StudyAbroad',
    studyAbroadSchema
);
