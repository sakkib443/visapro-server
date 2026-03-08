// ===================================================================
// VisaPro - PDF Extract Route (Groq AI powered)
// Flight ticket / visa document থেকে সব তথ্য extract করে
// ===================================================================

import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import Groq from 'groq-sdk';

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (_req: any, file: any, cb: any) => {
        const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and image files allowed'));
        }
    },
});

const ALL_DOCS_PROMPT = `You are an expert travel document data extractor for a visa consultancy system.
Analyze this document carefully. It could be a visa sticker, passport page, flight ticket, hotel booking, or any travel document.

Extract ALL visible information and return ONLY a valid JSON object. Use empty string "" for fields not found.

{
  "documentType": "visa | flight_ticket | passport | hotel_booking | itinerary | other",
  "documentNumber": "Main reference number (visa no / booking ref / passport no)",

  "fullNameEn": "Full name in English (e.g. MR GOLAM MONZUR AHAMED)",
  "fullNameBn": "Full name in Bengali if present",
  "dateOfBirth": "Date of birth",
  "placeOfBirth": "Place of birth",
  "gender": "Male or Female",
  "nationality": "Nationality",
  "religion": "Religion if shown",
  "maritalStatus": "Marital status if shown",
  "occupation": "Occupation / profession",
  "fatherName": "Father's name",
  "motherName": "Mother's name",

  "passportNo": "Passport number",
  "passportIssueDate": "Passport issue date",
  "passportExpiryDate": "Passport expiry date",
  "passportIssuePlace": "Passport issued place",

  "visaType": "Tourist / Student / Business / Work / Medical / Visit / Transit / Spouse/Family",
  "visaNumber": "Visa number",
  "country": "Destination country",
  "embassyName": "Embassy or consulate name",
  "visaIssueDate": "Visa issue date",
  "visaValidFrom": "Visa valid from date",
  "visaExpiryDate": "Visa expiry date",
  "entryType": "Single / Double / Multiple",
  "durationOfStay": "Allowed duration e.g. 30 Days",
  "numberOfEntries": "Number of entries allowed",
  "purposeOfVisit": "Purpose of visit",

  "airlineName": "Airline name e.g. Emirates",
  "flightNumber": "Flight number e.g. EK 585",
  "bookingRef": "Booking reference",
  "airlinePnr": "Airline PNR",
  "pnrCode": "PNR code",
  "fromCity": "Origin city or airport code e.g. DAC",
  "toCity": "Destination city or airport code e.g. DXB",
  "departureDate": "Departure date",
  "departureTime": "Departure time",
  "arrivalDate": "Arrival date",
  "arrivalTime": "Arrival time",
  "seatClass": "Seat class e.g. Economy",
  "baggageAllowance": "Baggage e.g. 1PC (23KG)",
  "transitInfo": "Transit information",
  "grandTotal": "Total fare amount",

  "hotelName": "Hotel name",
  "checkInDate": "Check-in date",
  "checkOutDate": "Check-out date",
  "roomType": "Room type",
  "hotelAddress": "Hotel address",

  "phone": "Phone number",
  "email": "Email address",
  "address": "Home or office address",
  "ticketPrice": "Ticket or visa price",
  "visaFee": "Visa fee",
  "currency": "Currency code e.g. BDT",

  "remarks": "Any other important information, conditions, or restrictions"
}

RULES:
- Extract EVERYTHING you can see in the document
- Return ONLY raw JSON, NO markdown, NO explanation
- For multiple passengers in flight ticket, use the FIRST passenger's details`;


// POST /api/pdf-extract
router.post('/', upload.single('pdf'), async (req: any, res: any) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const isPdf = file.mimetype === 'application/pdf';
        let extractedText = '';

        if (isPdf) {
            const pdfData = await pdfParse(file.buffer);
            extractedText = pdfData.text || '';
            console.log(`📄 PDF: ${pdfData.numpages} pages, ${extractedText.length} chars`);
        }

        // Use Groq AI for structured extraction
        const apiKey = (process.env.GROQ_API_KEY || '').trim();
        if (!apiKey || apiKey === 'your_groq_api_key_here') {
            // Fallback: return raw text only
            return res.status(200).json({
                success: true,
                aiParsed: false,
                data: { text: extractedText },
            });
        }

        const groq = new Groq({ apiKey });

        let aiResult: any = {};

        if (isPdf) {
            // PDF: text-based extraction
            const completion = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'user',
                        content: `${ALL_DOCS_PROMPT}\n\nDocument text:\n---\n${extractedText.slice(0, 8000)}\n---`,
                    },
                ],
                temperature: 0.1,
                max_tokens: 2000,
            });

            const text = completion.choices[0]?.message?.content?.trim() || '{}';
            const start = text.indexOf('{');
            const end = text.lastIndexOf('}');
            aiResult = JSON.parse(start !== -1 ? text.slice(start, end + 1) : '{}');
        } else {
            // Image: vision model
            const base64 = file.buffer.toString('base64');
            const dataUrl = `data:${file.mimetype};base64,${base64}`;

            const completion = await groq.chat.completions.create({
                model: 'meta-llama/llama-4-scout-17b-16e-instruct',
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: ALL_DOCS_PROMPT },
                            { type: 'image_url', image_url: { url: dataUrl } },
                        ] as any,
                    },
                ],
                temperature: 0.1,
                max_tokens: 2000,
            });

            const text = completion.choices[0]?.message?.content?.trim() || '{}';
            const start = text.indexOf('{');
            const end = text.lastIndexOf('}');
            aiResult = JSON.parse(start !== -1 ? text.slice(start, end + 1) : '{}');
        }

        console.log('✅ AI extraction complete:', JSON.stringify(aiResult).substring(0, 100));

        return res.status(200).json({
            success: true,
            aiParsed: true,
            data: {
                ...aiResult,
                text: extractedText, // raw text also available
            },
        });
    } catch (error: any) {
        console.error('❌ Extract error:', error.message);
        return res.status(500).json({
            success: false,
            message: error.message || 'Extraction failed',
        });
    }
});

export const PdfExtractRoutes = router;
