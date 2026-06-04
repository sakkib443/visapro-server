import { VisaApplication } from './visaApplication.model';
import AppError from '../../utils/AppError';

// Generate a fallback applicationId when the client does not provide one.
const generateApplicationId = () =>
    `VA-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;

// Create a new visa application (admin CRM record)
const createVisaApplication = async (payload: Record<string, unknown>) => {
    // Whitelist: only explicit schema fields are accepted (mass-assignment safe).
    const data: Record<string, unknown> = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone,
        passportNo: payload.passportNo,
        visaType: payload.visaType,
        country: payload.country,
        fee: payload.fee ?? 0,
        notes: payload.notes,
        status: payload.status,
        applicationId: payload.applicationId || generateApplicationId(),
        appliedDate: payload.appliedDate,
    };
    const application = await VisaApplication.create(data);
    return application;
};

// Get all visa applications (admin) - newest first, optional filter by status/country
const getAllVisaApplications = async (query: Record<string, string>) => {
    const filter: Record<string, string> = {};
    if (query.status) filter.status = query.status;
    if (query.country) filter.country = query.country;

    const applications = await VisaApplication.find(filter).sort({ createdAt: -1 });
    return applications;
};

// Get a single visa application by id (admin)
const getVisaApplicationById = async (id: string) => {
    const application = await VisaApplication.findById(id);
    if (!application) throw new AppError(404, 'Visa application not found');
    return application;
};

// Update a visa application incl. status (admin)
const updateVisaApplication = async (id: string, payload: Record<string, unknown>) => {
    // Whitelist: only explicit schema fields are updatable (mass-assignment safe).
    const data: Record<string, unknown> = {};
    if (payload.firstName !== undefined) data.firstName = payload.firstName;
    if (payload.lastName !== undefined) data.lastName = payload.lastName;
    if (payload.email !== undefined) data.email = payload.email;
    if (payload.phone !== undefined) data.phone = payload.phone;
    if (payload.passportNo !== undefined) data.passportNo = payload.passportNo;
    if (payload.visaType !== undefined) data.visaType = payload.visaType;
    if (payload.country !== undefined) data.country = payload.country;
    if (payload.fee !== undefined) data.fee = payload.fee;
    if (payload.notes !== undefined) data.notes = payload.notes;
    if (payload.status !== undefined) data.status = payload.status;
    if (payload.appliedDate !== undefined) data.appliedDate = payload.appliedDate;

    const application = await VisaApplication.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
    if (!application) throw new AppError(404, 'Visa application not found');
    return application;
};

// Delete a visa application (admin)
const deleteVisaApplication = async (id: string) => {
    const application = await VisaApplication.findByIdAndDelete(id);
    if (!application) throw new AppError(404, 'Visa application not found');
    return application;
};

export const VisaApplicationService = {
    createVisaApplication,
    getAllVisaApplications,
    getVisaApplicationById,
    updateVisaApplication,
    deleteVisaApplication,
};
