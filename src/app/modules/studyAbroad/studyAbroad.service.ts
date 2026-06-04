import { StudyAbroad } from './studyAbroad.model';
import AppError from '../../utils/AppError';

// Create a new study abroad program (admin)
const createStudyAbroad = async (payload: Record<string, unknown>) => {
    // Whitelist: only explicit schema fields are accepted (mass-assignment safe).
    const data: Record<string, unknown> = {
        name: payload.name,
        country: payload.country,
        university: payload.university,
        degree: payload.degree,
        duration: payload.duration,
        tuition: payload.tuition,
        deadline: payload.deadline,
        requirements: payload.requirements,
        scholarship: payload.scholarship,
        status: payload.status,
        applications: payload.applications,
    };
    const program = await StudyAbroad.create(data);
    return program;
};

// Get all study abroad programs (public) - newest first
const getAllStudyAbroad = async () => {
    const programs = await StudyAbroad.find().sort({ createdAt: -1 });
    return programs;
};

// Get a single study abroad program (public)
const getSingleStudyAbroad = async (id: string) => {
    const program = await StudyAbroad.findById(id);
    if (!program) throw new AppError(404, 'Study abroad program not found');
    return program;
};

// Update a study abroad program (admin)
const updateStudyAbroad = async (
    id: string,
    payload: Record<string, unknown>
) => {
    // Whitelist: only explicit schema fields are updatable (mass-assignment safe).
    const data: Record<string, unknown> = {};
    if (payload.name !== undefined) data.name = payload.name;
    if (payload.country !== undefined) data.country = payload.country;
    if (payload.university !== undefined) data.university = payload.university;
    if (payload.degree !== undefined) data.degree = payload.degree;
    if (payload.duration !== undefined) data.duration = payload.duration;
    if (payload.tuition !== undefined) data.tuition = payload.tuition;
    if (payload.deadline !== undefined) data.deadline = payload.deadline;
    if (payload.requirements !== undefined) data.requirements = payload.requirements;
    if (payload.scholarship !== undefined) data.scholarship = payload.scholarship;
    if (payload.status !== undefined) data.status = payload.status;
    if (payload.applications !== undefined) data.applications = payload.applications;

    const program = await StudyAbroad.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (!program) throw new AppError(404, 'Study abroad program not found');
    return program;
};

// Delete a study abroad program (admin)
const deleteStudyAbroad = async (id: string) => {
    const program = await StudyAbroad.findByIdAndDelete(id);
    if (!program) throw new AppError(404, 'Study abroad program not found');
    return program;
};

export const StudyAbroadService = {
    createStudyAbroad,
    getAllStudyAbroad,
    getSingleStudyAbroad,
    updateStudyAbroad,
    deleteStudyAbroad,
};
