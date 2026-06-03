// ===================================================================
// VisaPro - DocEntry Validation
// Zod validation schemas for DocEntry module
// ডকুমেন্ট এন্ট্রি মডিউলের ভ্যালিডেশন স্কিমা
// ===================================================================

import { z } from 'zod';

// All DocEntry fields are optional strings with schema-level defaults,
// so both create and update accept any subset of these keys.
// Extra (non-schema) keys are stripped by Zod and ignored by Mongoose.
const docEntryBodyShape = {
    documentType: z.string().optional(),
    documentNumber: z.string().optional(),
    fullNameEn: z.string().optional(),
    fullNameBn: z.string().optional(),
    dateOfBirth: z.string().optional(),
    placeOfBirth: z.string().optional(),
    gender: z.string().optional(),
    nationality: z.string().optional(),
    religion: z.string().optional(),
    maritalStatus: z.string().optional(),
    occupation: z.string().optional(),
    fatherName: z.string().optional(),
    motherName: z.string().optional(),
    passportNo: z.string().optional(),
    passportIssueDate: z.string().optional(),
    passportExpiryDate: z.string().optional(),
    passportIssuePlace: z.string().optional(),
    visaType: z.string().optional(),
    visaNumber: z.string().optional(),
    country: z.string().optional(),
    embassyName: z.string().optional(),
    visaIssueDate: z.string().optional(),
    visaValidFrom: z.string().optional(),
    visaExpiryDate: z.string().optional(),
    entryType: z.string().optional(),
    durationOfStay: z.string().optional(),
    numberOfEntries: z.string().optional(),
    purposeOfVisit: z.string().optional(),
    airlineName: z.string().optional(),
    flightNumber: z.string().optional(),
    pnrCode: z.string().optional(),
    bookingRef: z.string().optional(),
    fromCity: z.string().optional(),
    toCity: z.string().optional(),
    departureDate: z.string().optional(),
    departureTime: z.string().optional(),
    arrivalDate: z.string().optional(),
    arrivalTime: z.string().optional(),
    seatClass: z.string().optional(),
    baggageAllowance: z.string().optional(),
    transitInfo: z.string().optional(),
    hotelName: z.string().optional(),
    checkInDate: z.string().optional(),
    checkOutDate: z.string().optional(),
    roomType: z.string().optional(),
    hotelAddress: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    ticketPrice: z.string().optional(),
    currency: z.string().optional(),
    visaFee: z.string().optional(),
    remarks: z.string().optional(),
    agencyName: z.string().optional(),
    agencyPhone: z.string().optional(),
    agencyEmail: z.string().optional(),
    agencyWebsite: z.string().optional(),
    agencyOffice: z.string().optional(),
};

/**
 * Create DocEntry Validation Schema
 */
const createDocEntrySchema = z.object({
    body: z.object(docEntryBodyShape),
});

/**
 * Update DocEntry Validation Schema
 */
const updateDocEntrySchema = z.object({
    body: z.object(docEntryBodyShape),
});

export const DocEntryValidation = {
    createDocEntrySchema,
    updateDocEntrySchema,
};

// Whitelist of fields a client is allowed to set on a DocEntry.
// Used to build an explicit payload (prevents mass-assignment of
// non-schema / unexpected keys reaching the model layer).
export const DOC_ENTRY_FIELDS = Object.keys(docEntryBodyShape) as Array<
    keyof typeof docEntryBodyShape
>;
